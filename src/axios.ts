import Axios from "axios";
const { HOST, PORT, APIV } = process.env;
export default Axios.create({ baseURL: `${HOST}:${PORT}/api/${APIV}` });
