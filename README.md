# presidenciais-21
 
Os resultados (por freguesia) das eleições presidenciais de 2021 em Portugal num formato [tidy](https://cran.r-project.org/web/packages/tidyr/vignettes/tidy-data.html).
*Get the results (by parish) of the 2021 presidential elections in Portugal in a [tidy](https://cran.r-project.org/web/packages/tidyr/vignettes/tidy-data.html) format.*


Correr na linha de comandos 
*Run on the command line*

```bash
➜ python3 scrapper.py -f json -o results.json
```

Opções. *Options*

```bash
➜ python3 scrapper.py -h
usage: scrapper.py [-h] -o OUTPUT -f {csv,json}

optional arguments:
  -h, --help            show this help message and exit
  -o OUTPUT, --output OUTPUT
                        output file name
  -f {csv,json}, --format {csv,json}
                        output file format
```