const _chatSpace = {
    chats:[
        {
            secondRoomUser:"admin",
            roomId:null,
            messages:["Hey!, Welcome to chatify."]
        }
    ]
}

export default ChatReducer = (state=_chatSpace, action) => {
    const initial_state = state;
    switch(action.type){
        case "connected":
            return {
                chats: [...initial_state, action.payload.chats]
            }
    }
}