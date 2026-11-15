using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Liturgical.Dtos;

namespace GiaoLy.Application.Liturgical.Contracts;

public interface ILiturgicalService
{
    Task<Result<LiturgicalEventDto>> GetTodayAsync(CancellationToken ct = default);
    Task<Result<LiturgicalEventDto>> GetByDateAsync(DateOnly date, CancellationToken ct = default);
    Task<Result<List<LiturgicalEventDto>>> GetMonthAsync(int year, int month, CancellationToken ct = default);
    Task<Result<List<LiturgicalEventDto>>> GetAllAsync(int? year, int? month, CancellationToken ct = default);
    Task<Result<LiturgicalEventDto>> OverrideDayAsync(DateOnly date, OverrideLiturgicalDayRequest request, CancellationToken ct = default);
}
