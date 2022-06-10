const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 4000;

const app = express();

app.use(bodyParser.json());
app.use(cors());


//Mysql
const conn = mysql.createConnection({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'bb1ec472ec6a00',
    password: '44544233',
    database: 'heroku_e3f61f3e1572cb7',
});

conn.connect(function (err) {
    if (err) {
        console.log('error conecting:' + err.stack);
        return;
    }
    console.log('Conectado A la BD ' + conn.threadId)
})


//Mis rutas a
//default
app.get('/', (req, res) => {
    res.send('Bienvenido A la Api de Promociones')


    // res.send('welcome to my Api')
});


//Consultar productos
app.get("/productos", (req,res) => {
    const sql = "select * from productos"
    conn.query(sql,(error,resultados)=>{
        if(error) throw error;
        if (resultados.length > 0) {
            res.json(resultados)
        } else {
            res.send('Sin resultados en pedidos')
        }
    })
})


//Consultar Campañas
app.get("/campanas1", (req,res) => {
    const sql = "select * from campañas"
    conn.query(sql,(error,resultados)=>{
        if(error) throw error;
        if (resultados.length > 0) {
            res.json(resultados)
        } else {
            res.send('Sin resultados de campañas')
        }
    })
})

//Consultar Campañas Aprovadas o Finalizadas
app.get("/campanas2", (req,res) => {
    const sql = "select * from campañas where Estado = 'Finalizada' OR Estado = 'Autorizada'"
    conn.query(sql,(error,resultados)=>{
        if(error) throw error;
        if (resultados.length > 0) {
            res.json(resultados)
        } else {
            res.send('Sin resultados de campañas')
        }
    })
})

//Consultar Campañas Aprovadas(VENTAS)
app.get("/CampAutorizadas", (req,res) => {
    const sql = "select * from campañas where Estado = 'Autorizada'"
    conn.query(sql,(error,resultados)=>{
        if(error) throw error;
        if (resultados.length > 0) {
            res.json(resultados)
        } else {
            res.send('Sin resultados de campañas')
        }
    })
})


//Consultar Solicitudes (Todas)
app.get("/solicitudesAll", (req,res) => {
    const sql = "select * from solicitudes"
    conn.query(sql,(error,resultados)=>{
        if(error) throw error;
        if (resultados.length > 0) {
            res.json(resultados)
        } else {
            res.send('Sin resultados de solicitudes')
        }
    })
})

app.get("/solicitudesObs/:id", (req,res) =>{
    const { id } = req.params;
    const sql = `select id_solicitud from campañas where id_campaña = ${id}`
    conn.query(sql,(error,resultados)=>{
        if(error) throw error;
        if (resultados.length > 0) {
            res.json(resultados)
        } else {
            res.send('Sin resultados de solicitudes')
        }
    })
})

app.get("/solicitudesP", (req,res) => {
    const sql = "select * from solicitudes where estado = 'Pendiente'"
    conn.query(sql,(error,resultados)=>{
        if(error) throw error;
        if (resultados.length > 0) {
            res.json(resultados)
        } else {
            res.send('Sin resultados de solicitudes')
        }
    })
})

//Añadir Solicitud
app.post("/addsol", (req,res) => {
    const sql = "INSERT INTO solicitudes SET ?";
    const solicitudOBJ ={
        info:req.body.info,
        fecha:req.body.fecha,
        estado:req.body.estado,
        observacion:req.body.observacion
    }
    conn.query(sql,solicitudOBJ,error =>{
        if(error) throw error;
        res.send("Solicitud Creada");
    })
})

//Añadir Solicitud Lider
app.post("/addsol1", (req,res) => {
    const sql = "INSERT INTO solicitudes SET ?";
    const solicitudOBJ ={
        info:req.body.info,
        fecha:req.body.fecha,
        estado:req.body.estado
    }
    conn.query(sql,solicitudOBJ,error =>{
        if(error) throw error;
        res.send("Solicitud Creada");
    })
})


//Añadir Campaña
app.post("/addcamp", (req,res) => {
    const sql = "INSERT INTO campañas SET ?";
    const campañaOBJ ={
        NombreCampaña:req.body.NombreCampaña,
        Detalles:req.body.Detalles,
        id_producto:req.body.id_producto,
        id_solicitud:req.body.id_solicitud
    }
    conn.query(sql,campañaOBJ,error =>{
        if(error) throw error;
        res.send("Solicitud Creada");
    })
})


//Actualizar Campaña autorizada
app.put("/updateCamp/:id", (req,res) =>{
    const { id } = req.params;
    const { Estado, FechaI, FechaF } = req.body;
    const sql = `UPDATE campañas SET Estado ='${Estado}', FechaI ='${FechaI}', FechaF ='${FechaF}' WHERE id_campaña=${id}`;
    conn.query(sql, error => {
        if (error) throw error;
        res.send('Campaña Actualizada');
    });
})


//Actualizar Solicitud con observacion
app.put("/updateSol/:id", (req,res) =>{
    const { id } = req.params;
    const { estado, observacion } = req.body;
    const sql = `UPDATE solicitudes SET estado ='${estado}', observacion ='${observacion}' WHERE id_solicitudes=${id}`;
    conn.query(sql, error => {
        if (error) throw error;
        res.send('Solicitud Actualizada');
    });
})


//Eliminar Solicitud
app.delete('/deleteSol/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM solicitudes WHERE id_solicitudes=${id}`;

    conn.query(sql, error => {
        if (error) throw error;
        res.send('Solicitud Eliminada');
    })
})


//Eliminar Campaña
app.delete('/deleteCamp/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM campañas WHERE id_campaña=${id}`;

    conn.query(sql, error => {
        if (error) throw error;
        res.send('Campaña Eliminada');
    })
})


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});