# presidenciais-21

Que freguesias portuguesas são mais parecidas na forma como votam? Utilizando dados das eleições presidenciais de 2021, esta visualização distribui círculos representantes de cada freguesia no espaço de forma a preservar a distancia entre as suas distribuições de votos. Isto é, freguesias que votaram de forma parecida devem aparecer próximas na projeção. ([UMAP](https://github.com/lmcinnes/umap))

Ainda, o tamanho de cada circulo é proporcional ao número de votos da freguesia. Se uma freguesia votou muito mais num candidato, em comparação com o resto do país, a cor do seu circulo representa esse candidato.

_What portuguese parishes are more alike in the way they vote? Using data from the 2021 presidential elections, this visualization uses circles (representing the parishes) that are positioned to be closer together if the distance between the parishes' voting distribution is small. ([UMAP](https://github.com/lmcinnes/umap)_)

_The size of each circle is proportional to the number of votes in the parish. If a parish voted much more for a candidate compared to the rest of the country, then its color represents that candidate._

![interactive scatterplot](coverimage.gif)

### Data Processing

Python was used for scrapping the data, as well as running the pre-processing steps: tidy up the data, calculate distances between distributions, running UMAP to obtain the 2D projection. The scripts for the different steps of this pipeline are in `tools/`.

### Getting Started

1. `npm install`
2. `npm run dev`
