using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoListAPI.Data;
using ToDoListAPI.Models;

namespace ToDoListAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private AppDbContext _context;
        //DI
        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoTask>>> GetTasks()
        {
            return await _context.TodoTasks.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<TodoTask>> PostTask(TodoTask todoTask)
        {
            todoTask.StartDate = todoTask.StartDate.Date.AddHours(0).AddMinutes(0).AddSeconds(0);
            todoTask.Deadline = todoTask.Deadline.Date.AddHours(23).AddMinutes(59).AddSeconds(59);

            _context.TodoTasks.Add(todoTask);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTasks), new { id = todoTask.Id }, todoTask);
        }

        [HttpGet("by-date")]
        public async Task<ActionResult<IEnumerable<TodoTask>>> FetchByDate(DateTime date)
        {
            List<TodoTask> filteredTasks = await _context.TodoTasks
                .Where(task => task.StartDate <= date && task.Deadline >= date && task.IsCompleted == false)
                .ToListAsync();

            return Ok(filteredTasks);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTask(int id, TodoTask todoTask)
        {
            if (id != todoTask.Id)
            {
                return BadRequest("Wrong ID of the TodoTaks object");
            }

            todoTask.StartDate = todoTask.StartDate.Date.AddHours(0).AddMinutes(0).AddSeconds(0);
            todoTask.Deadline = todoTask.Deadline.Date.AddHours(23).AddMinutes(59).AddSeconds(59);

            _context.Entry(todoTask).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.TodoTasks.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var todoTask = await _context.TodoTasks.FindAsync(id);
            if (todoTask == null)
            {
                return NotFound();
            }

            _context.TodoTasks.Remove(todoTask);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<TodoTask>>> GetFilteredTasks(string filter)
        {
            DateTime today = DateTime.Today.AddHours(0).AddMinutes(0).AddSeconds(0);

            if (filter == "active")
            {
                List<TodoTask> activeTasks = await _context.TodoTasks
                    .Where(task => task.IsCompleted == false && task.Deadline >= today)
                    .ToListAsync();
                return Ok(activeTasks);
            }
            else if (filter == "completed")
            {
                List<TodoTask> completedTasks = await _context.TodoTasks
                    .Where(task => task.IsCompleted == true)
                    .ToListAsync();
                return Ok(completedTasks);
            }
            else if (filter == "overdue")
            {
                List<TodoTask> overdueTasks = await _context.TodoTasks
                    .Where(task => task.IsCompleted == false && task.Deadline < today)
                    .ToListAsync();
                return Ok(overdueTasks);
            }

            List<TodoTask> allTasks = await _context.TodoTasks.ToListAsync();
            return Ok(allTasks);
        }

        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<TodoTask>>> GetUpcomingTasks()
        {
            DateTime now = DateTime.Now;
            DateTime tommorow = now.AddDays(2).AddSeconds(-1);  //to see task that expire not in 24 but to end of next day

            List<TodoTask> upcomingTasks = await _context.TodoTasks
                .Where(task => task.IsCompleted == false && task.Deadline >= now && task.Deadline <= tommorow)
                .ToListAsync();

            return Ok(upcomingTasks);
        }
    }
}