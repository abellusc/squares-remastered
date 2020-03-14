import * as express from 'express';

const app = express();

app.use(express.json());
app.use(express.static('dist/public'));

app.get('/hiscores', (req: express.Request, res: express.Response, next: any) => {
    return res.status(200).json({});
});

console.log('binding to port');
app.listen(process.env.PORT || 8080, () => {
    console.log(`Listening on port ${process.env.PORT || 8080}`);
});