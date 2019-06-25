const express = require('express');

const app = express(); //definindo a variavel para criação das rotas

const port = 3000;

app.use(express.json());

let numberOfRequests = 0;

const projects = [{
    id: 1,
    title: 'Projeto 1',
    tasks: []
  },
  {
    id: 2,
    title: 'Projeto 2',
    tasks: []
  },
  {
    id: 3,
    title: 'Projeto 3',
    tasks: []
  }
];

//Middleware para identificar se o projeto existe.
function checkIdExists(req, res, next) {
  const {
    id
  } = req.params;
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(400).json({
      error: 'Project not Found'
    })
  }
  return next();
}


//Middelware global para contagem de requests
function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();

}

app.use(logRequests);


/**
 * Rotas do projeto
 */

app.get('/projects', (req, res) => {
  return res.json(projects);
})

app.post('/projects', (req, res) => {
  const {
    id,
    title
  } = req.body;

  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project);

  return res.json(project);

})

app.put('/projects/:id', checkIdExists, (req, res) => {
  const {
    id
  } = req.params; //recebe o id que vem com o parametro
  const {
    title
  } = req.body; //recebe o title que vem no corpo da mensagem

  const project = projects.find(p => p.id === id);
  project.title = title;

  return res.json(project);

})

app.delete('/projects/:id', checkIdExists, (req, res) => {
  const {
    id
  } = req.params;

  const projectIndex = projects.findIndex(p => p.id === id);

  projects.splice(projectIndex, 1);

  return res.json();

})

app.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const {
    id
  } = req.params; //pega o id vindo da rota params
  const title = req.body; //pega o title vindo do corpo da mensagem

  const project = projects.find(p => p.id === id); //Buscar o projeto pelo id

  project.tasks.push(title); //Jogar dentro do project.tasks um novo title.
  return res.json(projects)

})

app.listen(port, () =>
  console.log(`Server iniciou corretamente na porta: ${port}`)
)