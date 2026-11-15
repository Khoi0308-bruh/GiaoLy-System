using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.API.Middleware;
using GiaoLy.API.Services;
using GiaoLy.Domain.Data;
using GiaoLy.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.IdentityModel.Tokens;
using QuestPDF.Infrastructure;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

QuestPDF.Settings.License = LicenseType.Community;

// ── 0. Configuration Validation (Validate on start) ──────────────────────────
ConfigurationValidator.ValidateRequiredConfigurations(config, builder.Environment);

// ── 1. Infrastructure & Persistence (DbContextPool + AuditInterceptor + Scopes + Identity Services) ──
builder.Services.AddInfrastructure(config);

// ── 2. Rate Limiting ──────────────────────────────────────────────────────────
builder.Services.AddGiaoLyRateLimiting(config);

// ── 3. JWT Authentication ────────────────────────────────────────────────────
var jwtKey = config["Jwt:Key"]!;

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

// ── 4. Authorization Policies & Handlers ─────────────────────────────────────
builder.Services.AddSingleton<IAuthorizationPolicyProvider, PermissionAuthorizationPolicyProvider>();
builder.Services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();
builder.Services.AddScoped<IAuthorizationHandler, IsClassTeacherHandler>();
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("IsClassTeacher", policy =>
        policy.Requirements.Add(new IsClassTeacherRequirement()));
});

// ── 5. Background Services & Caching ─────────────────────────────────────────
builder.Services.AddHostedService<GradebookFinalizerService>();
builder.Services.AddHostedService<CatholicNewsCrawlerService>();
// IMemoryCache đã được đăng ký một lần trong AddInfrastructure() — không đăng ký lại ở đây.

// Named HttpClient for News ImageProxy (timeout 5s)
builder.Services.AddHttpClient("ImageProxy", client =>
{
    client.Timeout = TimeSpan.FromSeconds(5);
});

// ── 6. Other Services & Controllers ──────────────────────────────────────────
// LiturgicalService chỉ có một đăng ký: ILiturgicalService → Infrastructure (đã có trong AddInfrastructure).
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// ── 7. Swagger ───────────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ── 8. CORS ──────────────────────────────────────────────────────────────────
var allowedOrigins = config.GetSection("Cors:AllowedOrigins").Get<string[]>() 
                     ?? new[] { "http://localhost:3000", "http://localhost:3001" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNuxt", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

var app = builder.Build();

// ── Middleware Pipeline (Order per blueprint Section 2.5) ────────────────────
// Forwarded headers chỉ được tin từ proxy khai báo trong ReverseProxy:* (mặc định: loopback).
var forwardedHeadersOptions = ForwardedHeadersSetup.Build(config, app.Services.GetRequiredService<ILoggerFactory>().CreateLogger("ForwardedHeaders"));
if (forwardedHeadersOptions is not null)
{
    app.UseForwardedHeaders(forwardedHeadersOptions);
}
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<SecurityHeadersMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowNuxt");
app.UseRateLimiter();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseMiddleware<SessionValidationMiddleware>();
app.UseAuthorization();

app.MapControllers();

// ── Database Seeder ──────────────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        DbSeeder.SeedData(context, config, app.Environment);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Có lỗi xảy ra khi gieo dữ liệu (Seeding Database).");
    }
}

app.Run();
