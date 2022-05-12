const _chatSpace = {
    receiver:{},
    isActive:false
}

const ChatReducer = (state=_chatSpace, action) => {
    const initial_state = state;
    switch(action.type){
        case "gotEm":
            return {
                receiver: action.payload,
                isActive:true
            };

        case "cancelEm":
            return initial_state;

        default:
            return initial_state;
    }
}

export default ChatReducer;