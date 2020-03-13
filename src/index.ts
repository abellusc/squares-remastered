import * as express from 'express';

const app = express();

app.use(express.static('dist/public'));

console.log('binding to port');
app.listen(process.env.PORT || 8080, () => {
    console.log(`Listening on port ${process.env.PORT || 8080}`);
});