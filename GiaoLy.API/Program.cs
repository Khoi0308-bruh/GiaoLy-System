using GiaoLy.API.Authorization;
using GiaoLy.API.Services;
using GiaoLy.Domain.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

using QuestPDF.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

QuestPDF.Settings.License = LicenseType.Community;

// ── 1. Connection String ─────────────────────────────────────────────────────
var connectionString = config.GetConnectionString("DefaultConnection");

// ── 2. DbContextPool (Giai đoạn 5 — Thay AddDbContext để tái sử dụng connection) ──
// AddDbContextPool tái sử dụng DbContext instances thay vì tạo mới mỗi request.
// Giúp server Free (RAM 512MB) chịu tải tốt hơn, tránh tràn bộ nhớ.
// Lưu ý: AppDbContext chỉ nhận DbContextOptions → Hợp lệ để dùng Pool.
builder.Services.AddDbContextPool<AppDbContext>(options =>
    options.UseSqlServer(connectionString), poolSize: 128);

// ── 3. JWT Authentication ────────────────────────────────────────────────────
var jwtKey = config["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key chưa được cấu hình! Set biến môi trường Jwt__Key trên server.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config["Jwt:Issuer"],
            ValidAudience = config["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// ── 4. Authorization + ABAC Policy (Giai đoạn 3) ───────────────────────────
// IHttpContextAccessor: Cho phép Handler đọc route parameter từ URL hiện tại
builder.Services.AddHttpContextAccessor();
// Đăng ký ABAC Handler là Scoped để có thể inject DbContext
builder.Services.AddScoped<IAuthorizationHandler, IsClassTeacherHandler>();
builder.Services.AddAuthorization(options =>
{
    // Policy "IsClassTeacher": Kiểm tra người dùng có phải GLV phụ trách lớp không.
    // Admin (Role 1) và Secretary (Role 2) tự động bypass trong Handler.
    options.AddPolicy("IsClassTeacher", policy =>
        policy.Requirements.Add(new IsClassTeacherRequirement()));
});

// ── 5. Background Service ────────────────────────────────────────────────────
builder.Services.AddHostedService<GradebookFinalizerService>(); // Tự động khóa sổ điểm
builder.Services.AddHostedService<CatholicNewsCrawlerService>(); // Cào tin Công giáo vào DB (2AM VN mỗi ngày)
builder.Services.AddMemoryCache();

// Named HttpClient cho NewsController.ImageProxy (timeout 5s)
builder.Services.AddHttpClient("ImageProxy", client =>
{
    client.Timeout = TimeSpan.FromSeconds(5);
});


// ── 6. Other Services ────────────────────────────────────────────────────────
builder.Services.AddScoped<LiturgicalService>(); // Lịch Phụng vụ (Đổi thành Scoped để dùng DbContext)
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        // Serialize enum thành string (VD: "All", "Urgent") thay vì số nguyên (0, 1)
        // Giúp Frontend dễ đọc và tránh lỗi mismatch khi filter
        opts.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });


// ── 7. Swagger ───────────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ── 8. CORS – Đọc cấu hình từ appsettings ────────────────────────────
var allowedOrigins = config.GetSection("Cors:AllowedOrigins").Get<string[]>() 
                     ?? new[] { "http://localhost:3000", "http://localhost:3001" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNuxt", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials()); // Thêm AllowCredentials nếu cần
});

var app = builder.Build();

// ── Middleware Pipeline ───────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowNuxt");
app.UseHttpsRedirection();
app.UseAuthentication(); // Phải đứng trước Authorization
app.UseAuthorization();
app.MapControllers();

// ── Database Seeder (Giai đoạn 1C — Truyền config để đọc mật khẩu từ ENV) ──
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        DbSeeder.SeedData(context, config); // config chứa App:DefaultPassword từ ENV
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Có lỗi xảy ra khi gieo dữ liệu (Seeding Database).");
    }
}

app.Run();