using GiaoLy.Domain.Enums;
using GiaoLy.Domain.Rules;

namespace GiaoLy.Domain.Entities;

public class Student
{
    private string _fullName = string.Empty;
    private string _status = StudentStateMachine.StatusActive;

    public Guid Id { get; set; } = Guid.NewGuid();
    public string Code { get; set; } = string.Empty; // TN + 2 số năm + 4 số thứ tự (ví dụ: TN260001)
    public string StudentCode => Code;
    public string HolyName { get; set; } = string.Empty;

    public string FullName
    {
        get => _fullName;
        set
        {
            _fullName = value ?? string.Empty;
            FullNameNormalized = VietnameseNormalizer.NormalizeName(_fullName);
        }
    }

    public string FullNameNormalized { get; set; } = string.Empty;

    public DateTime BirthDate { get; set; }
    public string? Gender { get; set; } // "M", "F", hoặc "Nam", "Nữ"

    public int? BranchId { get; set; }
    public Branch? BranchEntity { get; set; }

    public string Status
    {
        get => _status;
        set => _status = value ?? StudentStateMachine.StatusActive;
    }

    public DateOnly? JoinedOn { get; set; }
    public DateOnly? LeftOn { get; set; }

    public string? Area { get; set; }
    public string? Address { get; set; }

    // Thông tin sức khỏe
    public string? BloodType { get; set; }
    public string? Allergies { get; set; }
    public string? HealthNotes { get; set; }

    public Guid? FamilyId { get; set; }
    public Family? Family { get; set; }

    public DateTime? GuardianConsentAt { get; set; }
    public bool HasPhotoConsent { get; set; } = false;
    public string? PhotoUrl { get; set; }
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public byte[]? RowVersion { get; set; }

    // Navigations
    public ICollection<StudentGuardian> Guardians { get; set; } = new List<StudentGuardian>();
    public ICollection<StudentNote> StudentNotes { get; set; } = new List<StudentNote>();
    public ICollection<StudentStatusChange> StatusChanges { get; set; } = new List<StudentStatusChange>();
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    public ICollection<StudentSacrament> Sacraments { get; set; } = new List<StudentSacrament>();
    public ICollection<StudentRequirementProgress> RequirementProgresses { get; set; } = new List<StudentRequirementProgress>();

    // Compatibility properties for legacy code
    public bool IsActive
    {
        get => Status == StudentStateMachine.StatusActive && DeletedAt == null;
        set
        {
            if (value && Status != StudentStateMachine.StatusActive)
            {
                Status = StudentStateMachine.StatusActive;
            }
            else if (!value && Status == StudentStateMachine.StatusActive)
            {
                Status = StudentStateMachine.StatusPaused;
            }
        }
    }

    public HolyBranch Branch
    {
        get => (HolyBranch)(BranchId ?? 0);
        set => BranchId = (int)value;
    }

    public string? ClassName { get; set; }

    public DateTime? BaptismDate { get; set; }
    public string? BaptismPlace { get; set; }
    public DateTime? CommunionDate { get; set; }
    public string? CommunionPlace { get; set; }
    public DateTime? ConfirmationDate { get; set; }
    public string? ConfirmationPlace { get; set; }

    public string? FatherName { get; set; }
    public string? FatherPhone { get; set; }
    public string? FatherReligion { get; set; }
    public string? FatherJob { get; set; }

    public string? MotherName { get; set; }
    public string? MotherPhone { get; set; }
    public string? MotherReligion { get; set; }
    public string? MotherJob { get; set; }

    public string? ParentName { get; set; }
    public string? ParentPhone { get; set; }

    public string? BaptismGodparent { get; set; }
    public string? BaptismPriest { get; set; }
    public string? CommunionPriest { get; set; }
    public string? ConfirmationGodparent { get; set; }
    public string? ConfirmationBishop { get; set; }
}
