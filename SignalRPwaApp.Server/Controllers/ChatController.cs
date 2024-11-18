﻿using Microsoft.AspNetCore.Mvc;
using SignalRPwaApp.Server.Dtos;
using SignalRPwaApp.Server.Services;

namespace SignalRPwaApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;
        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("register-user")]
        public IActionResult RegisterUser(UserDto model)
        {
            if (_chatService.AddUserToList(model.Name))
            {
                return NoContent();
            }
            return BadRequest("This name is taken please choose another name");

        }
    }
}
