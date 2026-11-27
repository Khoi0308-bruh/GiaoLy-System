namespace GiaoLy.Domain.Rules;

/// <summary>
/// Quy tắc ngày sinh dùng chung cho mọi đường ghi hồ sơ đoàn sinh (tạo tay, sửa,
/// nhập Excel). DTO tạo đoàn sinh dùng <c>DateOnly</c> không nullable, nên khi client
/// bỏ trống trường ngày sinh model binder điền <c>default</c> = 01/01/0001; nếu chỉ
/// chặn "ngày tương lai" thì hồ sơ rác vẫn lọt qua. Vì vậy mốc dưới phải chặn cả
/// giá trị mặc định lẫn ngày sinh vô lý.
/// </summary>
public static class StudentBirthDateRules
{
    /// <summary>Ngày sinh sớm nhất được chấp nhận.</summary>
    public static readonly DateOnly MinBirthDate = new(1900, 1, 1);

    /// <summary>Ngày sinh hợp lệ: không sớm hơn <see cref="MinBirthDate"/> và không ở tương lai.</summary>
    public static bool IsValid(DateOnly birthDate, DateOnly today)
        => birthDate >= MinBirthDate && birthDate <= today;

    /// <summary>
    /// Trả về thông báo lỗi (tiếng Việt) nếu ngày sinh không hợp lệ, hoặc <c>null</c> nếu hợp lệ.
    /// </summary>
    public static string? GetError(DateOnly birthDate, DateOnly today)
    {
        if (birthDate < MinBirthDate)
        {
            return "Ngày sinh không hợp lệ. Vui lòng nhập ngày sinh thực tế của đoàn sinh (sau 01/01/1900).";
        }

        if (birthDate > today)
        {
            return "Ngày sinh của đoàn sinh không thể ở tương lai.";
        }

        return null;
    }
}
