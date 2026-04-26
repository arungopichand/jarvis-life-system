using System.ComponentModel.DataAnnotations;

namespace Jarvis.Api.Contracts;

public class CreateBlogDraftRequest
{
    [Required]
    [StringLength(180, MinimumLength = 2)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(140, MinimumLength = 2)]
    public string Topic { get; set; } = string.Empty;

    [Required]
    [StringLength(10000, MinimumLength = 2)]
    public string Content { get; set; } = string.Empty;

    [RegularExpression("^(Draft|Ready)$")]
    public string Status { get; set; } = "Draft";
}
