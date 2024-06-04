import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();
app.use(cors());
const httpServer=createServer(app)

const io = new Server(httpServer)

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("Serever is running!");
});
app.post("/runcode", (req, res) => {
   
    // console.log(req.body)
    const script = req.body.script
    let language = req.body.language
    if(language=="javascript"){
      language="nodejs"
    }
    if(language=="python"){
      language="python3"
    }
    // console.log(JSON.stringify(script))
    
        const data = fetch('https://api.jdoodle.com/v1/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            
          },
          body: JSON.stringify({
            script: script,
            language: language,
            versionIndex: '',
            clientId: '5ba65790e79d996a95c0dabd77ba55c9',
            clientSecret: '4a2a62d3395ef874b9179a659bfc3f3110ed07c7b1196fe2ab5c5e2a9fef9e98',
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            
            res.json({"status":"success","message":data})
          })
          .catch((error) => console.error(error));
        

    

   
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on('edit', (content, lang) => {
    console.log(content);
    console.log(lang);
    io.emit('updateContent', content, lang);
});
})
httpServer.listen(5000, () => console.log("Server started on port 5000"))