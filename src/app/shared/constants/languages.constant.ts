const languages: Array<any> = [
    { key: 'pt', value: 'Português' },
    { key: 'en', value: 'Inglês' }
];
export class Languages {

    /**
     * Retorna array com os objetos contendo as linguagens disponíveis na aplicação.
     * 
     * @returns {Array<any>} 
     * 
     * @memberOf Languages
     */
    public static getLanguages(): Array<any> {
        return languages;
    }

    /**
     * Retorna array com apenas a keys das linguagens disponíveis
     * 
     * @returns {Array<string>} 
     * 
     * @memberOf Languages
     */
    public getKeysLanguages(): Array<string> {
        return languages.map(elem => elem.key);
    }
}