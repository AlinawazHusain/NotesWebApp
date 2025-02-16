const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const PORT = 3000;

const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static('public'));
app.set("view engine" , "ejs")
app.set("views" , path.join(__dirname , 'views'));


app.get('/' , async(req , res)=>{
    try{
        var data = [];
        const rootdir = path.join(__dirname , 'notes');
        try{
            const files = await fs.readdir(rootdir);
            for (const file of files){
                const filepath = path.join(__dirname , 'notes' , file);
                var notedata = await fs.readFile(filepath , 'utf-8');
                const tempdata = {[file.slice(0 , -4)]: notedata};
                data.push(tempdata);
            }
            res.render('home' , {data});
        }
        catch(err){
            res.render('home' , {data});
        }
    }
    catch(err){
        console.error('Error reading directory or files:', err);
        res.status(500).send("Error reading files");
    }
});

app.post('/submit' , async(req , res)=>{
    const title = req.body.Title;
    const note = req.body.note;
    const rootdir = path.join(__dirname , 'notes');
    try{
        const files = await fs.readdir(rootdir);
    }
    catch(err){
        await fs.mkdir('notes');
    }
    await fs.writeFile(`notes/${title}.txt` , note , (err)=>{
        if(err){
            return res.status(500).send("Error in writing file");
        }
    });
    res.redirect('/'); 
});

app.post('/delete/:txtfile' , async(req , res)=>{
    const filename = req.params.txtfile;
    await fs.unlink(`./notes/${filename}.txt`);
    res.redirect('/');
});
app.listen(PORT , ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
