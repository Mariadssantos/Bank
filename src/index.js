const express = require('express');
const { v4: uuidv4 } = require('uuid')

const app = express();

app.use(express.json());

const customers = [];

function verifyIfExistsAccoutCPF(req, res, next) {
    const { cpf } = req.headers;

    const customer = customers.find((customers) => customers.cpf === cpf);

    if(!customer){
        return res.status(400).json({error: 'Customer not found'})
    }

    req.customer = customer;

    return next();
}

app.post("/account", (req, res) => {
    const { name, cpf } = req.body;

    const costumersAlreadyExist = customers.some((customers) => customers.cpf ===  cpf);

    if(costumersAlreadyExist){
        return res.status(400).json({error: "Costumers already exists!"})
    }

    customers.push({ 
        cpf,
        name,
        id:  uuidv4(),
        statement: [],
    });

    return res.status(201).send();
});

app.get("/statement", verifyIfExistsAccoutCPF, (req, res) => {
    const { customer } = req;
    return res.json(customers.statement);
});

app.listen(3333);