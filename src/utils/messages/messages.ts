// Note: All kind of api, success or errors messages status are defined here...!

type MessageType = 'success' | 'error' | 'warning' | 'info';

const messages: Record<MessageType, MessageType> = {
    success: "success",
    error: "error",
    warning: "warning",
    info: "info"
};

export default messages;