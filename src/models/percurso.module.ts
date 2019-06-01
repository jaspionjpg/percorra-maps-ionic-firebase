import { Ponto } from "./ponto.module";

export class Percurso {
    
    public $key: string;

    public aberto: boolean;
    
    constructor(
        public pontos: Ponto[],
        public nome: string
    ){}
}