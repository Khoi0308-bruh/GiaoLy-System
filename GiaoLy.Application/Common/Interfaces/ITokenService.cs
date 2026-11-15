using GiaoLy.Domain.Entities;

namespace GiaoLy.Application.Common.Interfaces;

public interface ITokenService
{
    Task<string> GenerateAccessTokenAsync(User user, string roleCode, string scopeType, CancellationToken ct = default);
    (string RawToken, string TokenHash, DateTime ExpiresAt) GenerateRefreshToken();
    string HashToken(string rawToken);
}
