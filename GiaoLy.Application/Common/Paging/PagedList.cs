namespace GiaoLy.Application.Common.Paging;

public class PagedList<T>
{
    public IReadOnlyList<T> Items { get; }
    public int Page { get; }
    public int PageSize { get; }
    public int TotalCount { get; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;

    public PagedList(IReadOnlyList<T> items, int totalCount, int page, int pageSize)
    {
        Items = items;
        TotalCount = totalCount;
        Page = page;
        PageSize = pageSize > 0 ? pageSize : 20;
    }

    public static PagedList<T> Empty(int page = 1, int pageSize = 20)
        => new(Array.Empty<T>(), 0, page, pageSize);
}
