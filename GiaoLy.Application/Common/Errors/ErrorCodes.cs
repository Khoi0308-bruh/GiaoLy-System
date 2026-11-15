namespace GiaoLy.Application.Common.Errors;

public static class ErrorCodes
{
    // Authentication & Identity
    public const string AuthInvalidCredentials = "AUTH_INVALID_CREDENTIALS";
    public const string AuthLocked = "AUTH_LOCKED";
    public const string AuthTokenRevoked = "AUTH_TOKEN_REVOKED";
    public const string AuthMustChangePassword = "AUTH_MUST_CHANGE_PASSWORD";
    public const string AuthPasswordWeak = "AUTH_PASSWORD_WEAK";
    public const string Forbidden = "FORBIDDEN";
    public const string NotFound = "NOT_FOUND";
    public const string ValidationFailed = "VALIDATION_FAILED";
    public const string ConflictVersion = "CONFLICT_VERSION";
    public const string ConflictDuplicate = "CONFLICT_DUPLICATE";

    // Organization & Academic Years
    public const string YearLocked = "YEAR_LOCKED";
    public const string YearInvalidTransition = "YEAR_INVALID_TRANSITION";
    public const string EnrollmentExists = "ENROLLMENT_EXISTS";

    // Promotion
    public const string PromotionStale = "PROMOTION_STALE";
    public const string PromotionNoTarget = "PROMOTION_NO_TARGET";

    // Certificates
    public const string CertAlreadyIssued = "CERT_ALREADY_ISSUED";
    public const string CertRevoked = "CERT_REVOKED";

    // Imports
    public const string ImportHasErrors = "IMPORT_HAS_ERRORS";

    // Privilege & Admin
    public const string PrivilegeEscalation = "PRIVILEGE_ESCALATION";
    public const string LastAdmin = "LAST_ADMIN";

    // Security & Platform
    public const string RateLimited = "RATE_LIMITED";
    public const string UploadInvalid = "UPLOAD_INVALID";
    public const string UrlBlocked = "URL_BLOCKED";
    public const string InternalError = "INTERNAL_ERROR";
}
