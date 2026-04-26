using Jarvis.Api.Contracts;
using Jarvis.Api.Data;
using Jarvis.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public ExpensesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Expense>>> GetAll()
    {
        var expenses = await _dbContext.Expenses
            .OrderByDescending(e => e.ExpenseDate)
            .ThenByDescending(e => e.Id)
            .ToListAsync();

        return Ok(expenses);
    }

    [HttpGet("today")]
    public async Task<ActionResult<IEnumerable<Expense>>> GetToday()
    {
        var today = DateTime.Today;

        var todayExpenses = await _dbContext.Expenses
            .Where(e => e.ExpenseDate.Date == today)
            .OrderByDescending(e => e.Id)
            .ToListAsync();

        return Ok(todayExpenses);
    }

    [HttpPost]
    public async Task<ActionResult<Expense>> Create([FromBody] CreateExpenseRequest request)
    {
        var expense = new Expense
        {
            Title = request.Title.Trim(),
            Amount = request.Amount,
            Category = request.Category.Trim(),
            ExpenseDate = request.ExpenseDate?.Date ?? DateTime.Today
        };

        _dbContext.Expenses.Add(expense);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = expense.Id }, expense);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var expense = await _dbContext.Expenses.FirstOrDefaultAsync(e => e.Id == id);

        if (expense is null)
        {
            return NotFound();
        }

        _dbContext.Expenses.Remove(expense);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}
