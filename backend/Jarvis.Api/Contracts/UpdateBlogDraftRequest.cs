using System.ComponentModel.DataAnnotations;

namespace Jarvis.Api.Contracts;

public class UpdateBlogDraftRequest
{
    [StringLength(180, MinimumLength = 2)]
    public string? Title { get; set; }

    [StringLength(140, MinimumLength = 2)]
    public string? Topic { get; set; }

    [StringLength(10000, MinimumLength = 2)]
    public string? Content { get; set; }

    [RegularExpression("^(Draft|Ready)$")]
    public string? Status { get; set; }
}
