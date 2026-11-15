using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.News.Dtos;

namespace GiaoLy.Application.News.Contracts;

public interface INewsService
{
    Task<Result<List<NewsArticleDto>>> GetPublicNewsAsync(int page = 1, int pageSize = 20, Guid? sourceId = null, CancellationToken ct = default);
    Task<Result<ProxyImageResultDto>> ProxyImageAsync(string imageUrl, CancellationToken ct = default);
    Task<Result<List<NewsSourceDto>>> GetNewsSourcesAsync(CancellationToken ct = default);
    Task<Result<NewsSourceDto>> CreateNewsSourceAsync(CreateNewsSourceRequest request, CancellationToken ct = default);
    Task<Result<NewsSourceDto>> UpdateNewsSourceAsync(Guid id, UpdateNewsSourceRequest request, CancellationToken ct = default);
    Task<Result<bool>> DeleteNewsSourceAsync(Guid id, CancellationToken ct = default);
    Task<Result<bool>> SetArticleActiveAsync(Guid id, bool isActive, CancellationToken ct = default);
}
