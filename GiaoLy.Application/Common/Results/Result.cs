using System.Text.Json.Serialization;
using GiaoLy.Application.Common.Errors;

namespace GiaoLy.Application.Common.Results;

public class Result
{
    public bool IsSuccess { get; }
    public int StatusCode { get; }
    public string? ErrorCode { get; }
    public string? Message { get; }
    public IDictionary<string, string[]>? Errors { get; }

    [JsonIgnore]
    public bool IsFailure => !IsSuccess;

    protected Result(bool isSuccess, int statusCode, string? errorCode = null, string? message = null, IDictionary<string, string[]>? errors = null)
    {
        IsSuccess = isSuccess;
        StatusCode = statusCode;
        ErrorCode = errorCode;
        Message = message;
        Errors = errors;
    }

    public static Result Ok() => new(true, 200);
    public static Result<T> Ok<T>(T value) => Result<T>.Success(value, 200);
    public static Result<T> Created<T>(T value) => Result<T>.Success(value, 201);
    public static Result NoContent() => new(true, 204);

    public static Result Failure(int statusCode, string errorCode, string message, IDictionary<string, string[]>? errors = null)
        => new(false, statusCode, errorCode, message, errors);

    public static Result<T> Failure<T>(int statusCode, string errorCode, string message, IDictionary<string, string[]>? errors = null)
        => Result<T>.Failure(statusCode, errorCode, message, errors);

    public static Result NotFound(string message = "Không tìm thấy dữ liệu yêu cầu.")
        => Failure(404, ErrorCodes.NotFound, message);

    public static Result<T> NotFound<T>(string message = "Không tìm thấy dữ liệu yêu cầu.")
        => Failure<T>(404, ErrorCodes.NotFound, message);

    public static Result Forbidden(string message = "Bạn không có quyền thực hiện thao tác này.")
        => Failure(403, ErrorCodes.Forbidden, message);

    public static Result<T> Forbidden<T>(string message = "Bạn không có quyền thực hiện thao tác này.")
        => Failure<T>(403, ErrorCodes.Forbidden, message);

    public static Result BadRequest(string errorCode, string message, IDictionary<string, string[]>? errors = null)
        => Failure(400, errorCode, message, errors);

    public static Result<T> BadRequest<T>(string errorCode, string message, IDictionary<string, string[]>? errors = null)
        => Failure<T>(400, errorCode, message, errors);

    public static Result Conflict(string errorCode, string message)
        => Failure(409, errorCode, message);

    public static Result Conflict(string message)
        => Failure(409, ErrorCodes.ConflictDuplicate, message);

    public static Result<T> Conflict<T>(string errorCode, string message)
        => Failure<T>(409, errorCode, message);

    public static Result<T> Conflict<T>(string message)
        => Failure<T>(409, ErrorCodes.ConflictDuplicate, message);

    public static Result ValidationFailure(IDictionary<string, string[]> errors, string message = "Dữ liệu gửi lên không hợp lệ.")
        => Failure(400, ErrorCodes.ValidationFailed, message, errors);

    public static Result<T> ValidationFailure<T>(IDictionary<string, string[]> errors, string message = "Dữ liệu gửi lên không hợp lệ.")
        => Failure<T>(400, ErrorCodes.ValidationFailed, message, errors);

    public static Result Validation(string message, string? propertyName = null)
    {
        var errors = propertyName != null
            ? new Dictionary<string, string[]> { [propertyName] = [message] }
            : null;
        return Failure(400, ErrorCodes.ValidationFailed, message, errors);
    }

    public static Result<T> Validation<T>(string message, string? propertyName = null)
    {
        var errors = propertyName != null
            ? new Dictionary<string, string[]> { [propertyName] = [message] }
            : null;
        return Failure<T>(400, ErrorCodes.ValidationFailed, message, errors);
    }

    public static Result BadRequest(string message)
        => Failure(400, ErrorCodes.ValidationFailed, message);

    public static Result<T> BadRequest<T>(string message)
        => Failure<T>(400, ErrorCodes.ValidationFailed, message);
}

public class Result<T> : Result
{
    public T? Value { get; }

    protected Result(T? value, bool isSuccess, int statusCode, string? errorCode = null, string? message = null, IDictionary<string, string[]>? errors = null)
        : base(isSuccess, statusCode, errorCode, message, errors)
    {
        Value = value;
    }

    public static Result<T> Success(T value, int statusCode = 200) => new(value, true, statusCode);
    public static Result<T> Ok(T value) => Success(value, 200);
    public static Result<T> Created(T value) => Success(value, 201);

    public static new Result<T> Failure(int statusCode, string errorCode, string message, IDictionary<string, string[]>? errors = null)
        => new(default, false, statusCode, errorCode, message, errors);

    public static new Result<T> NotFound(string message = "Không tìm thấy dữ liệu yêu cầu.")
        => Failure(404, ErrorCodes.NotFound, message);

    public static new Result<T> Forbidden(string message = "Bạn không có quyền thực hiện thao tác này.")
        => Failure(403, ErrorCodes.Forbidden, message);

    public static new Result<T> Conflict(string message)
        => Failure(409, ErrorCodes.ConflictDuplicate, message);

    public static new Result<T> Conflict(string errorCode, string message)
        => Failure(409, errorCode, message);

    public static new Result<T> Validation(string message, string? propertyName = null)
    {
        var errors = propertyName != null
            ? new Dictionary<string, string[]> { [propertyName] = [message] }
            : null;
        return Failure(400, ErrorCodes.ValidationFailed, message, errors);
    }

    public static new Result<T> BadRequest(string message)
        => Failure(400, ErrorCodes.ValidationFailed, message);

    public static implicit operator Result<T>(T value) => Ok(value);
}
