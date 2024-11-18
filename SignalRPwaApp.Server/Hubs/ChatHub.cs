using Microsoft.AspNetCore.SignalR;
using SignalRPwaApp.Server.Services;

namespace SignalRPwaApp.Server.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ChatService _chatService;
        public ChatHub(ChatService chatService)
        {
            _chatService = chatService;
        }

        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "ComeToChat");
            await Clients.Caller.SendAsync("UserConnected");
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "ComeToChat");
            await base.OnDisconnectedAsync(exception);
        }
    }
}
