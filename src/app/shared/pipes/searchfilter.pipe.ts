import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchfilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any, field: string, value: string): any {
    if (!items) return [];

    return items.filter(element => this.removeAccents(element[field]).toLowerCase().includes(this.removeAccents(value).toLowerCase()));
  }

  /**
   * Remove acentos da string, substituindo o caracter pelo mesmo sem acento.
   * 
   * @param {string} value 
   * @returns {string} 
   * 
   * @memberOf SearchFilterPipe
   */
  private removeAccents(value: string): string {
    if(!value) return '';
    
    let map: any = {
      "â": "a", "Â": "A", "à": "a", "À": "A", "á": "a", "Á": "A", "ã": "a", "Ã": "A", "ê": "e", "Ê": "E",
      "è": "e", "È": "E", "é": "e", "É": "E", "î": "i", "Î": "I", "ì": "i", "Ì": "I", "í": "i", "Í": "I",
      "õ": "o", "Õ": "O", "ô": "o", "Ô": "O", "ò": "o", "Ò": "O", "ó": "o", "Ó": "O", "ü": "u", "Ü": "U",
      "û": "u", "Û": "U", "ú": "u", "Ú": "U", "ù": "u", "Ù": "U", "ç": "c", "Ç": "C"
    };

    return value.replace(/[\W\[\] ]/g, (character) => map[character] || character);
  }
}
