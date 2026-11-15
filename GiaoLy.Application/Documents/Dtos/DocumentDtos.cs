using System;
using System.IO;

namespace GiaoLy.Application.Documents.Dtos;

public class DocumentDto
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int? BranchId { get; set; }
    public string? BranchName { get; set; }
    public Guid? AcademicYearId { get; set; }
    public string? AcademicYearName { get; set; }
    public string AccessLevel { get; set; } = "Internal";
    public string? Tags { get; set; }
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public string Sha256 { get; set; } = string.Empty;
    public Guid UploadedBy { get; set; }
    public string UploadedByName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class DocumentDownloadDto
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public Stream ContentStream { get; set; } = Stream.Null;
    public long FileSize { get; set; }
}

public class CreateDocumentRequest
{
    public string FileName { get; set; } = string.Empty;
    public string Category { get; set; } = "Giáo án";
    public int? BranchId { get; set; }
    public Guid? AcademicYearId { get; set; }
    public string AccessLevel { get; set; } = "Internal";
    public string? Tags { get; set; }
    public string ContentType { get; set; } = "application/octet-stream";
    public byte[] FileBytes { get; set; } = Array.Empty<byte>();
}

public class UpdateDocumentRequest
{
    public string FileName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int? BranchId { get; set; }
    public Guid? AcademicYearId { get; set; }
    public string AccessLevel { get; set; } = "Internal";
    public string? Tags { get; set; }
}
