const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors({
  origin: '*'
}));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(express.json());



const getInterviewQuestions = (questionInput) => {
  const { cv, jobDescription, instructions } = questionInput;
  return new Promise((resolve, reject) => {
    openai
      .createChatCompletion({
        model: 'gpt-3.5-turbo-16k',
        messages: [
          {
            role: 'user',
            content: `This is my CV ${cv}\n This is the job description:${jobDescription}\n${instructions}\n`,
          },
        ],
      })
      .then((res) => {
        const response = res.data.choices[0].message?.content;
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/data', async (req, res) => {
  try {
    const data = req.body;
    console.log('Received data:', data);
    
    // Call the getInterviewQuestions function
    const interviewQuestions = await getInterviewQuestions(data);
    console.log('Interview questions:', interviewQuestions);

    // Send the interviewQuestions as the response
    res.json({ interviewQuestions });


  } catch (error) {
    console.error('Error:', error);
    res.sendStatus(500);
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
