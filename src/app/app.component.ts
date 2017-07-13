import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  public fileString;
  private content;

  constructor() {
    this.fileString;
  }
  
  /*
  Metodo responsavel por limpar o campo de upload.
 */
  clearField(): void{
    document.getElementById("mostraHtml").style.display = "none";
  }

  /*
  Metodo responsavel por carregar o arquivo.
 */
  loadFile(): void {
    this.clearField();
    var file = document.getElementById("origem");
    this.readThis(file);
  }

  /*
  Metodo responsavel por ler o arquivo inserido.
 */
  readThis(inputValue: any): void {
    var file: File = inputValue.files[0]; // ler a primeira posição de arquivo que foi inserido.
    var myReader: FileReader = new FileReader(); 
    myReader.onloadend = function (e) { // quando terminar de ler e carregar o arquivo, chamar o moto principal.
      AppComponent.prototype.convMain(myReader.result); // chamada do moto principal.
    }
    myReader.readAsText(file); //ler o arquivo inserido ao mesmo tempo que o onloadend e carregado.
  }

  downloadContent(){ // 

    var uriContent = encodeURIComponent(this.content);  // this.content variavel global que recebe o resultado do motor principal.
    
    var link = document.createElement('a');
    link.download = 'xhtmlConvertido.html'; // nome do arquivo gerado
    link.href = 'data:,' + uriContent;
    link.click(); // ação do botão

  }

  convMain(strHtml: string): void { //motor principal, concentra todas as chamadas para invocar os demais ações.

    let strHtmlConvertido: string = "";
    let strTag: string;
    let posicao: number = 0;
    let arrayTag: RegExpMatchArray;
    let arrayTagFrom: string[];
    let arrayCloseTagTo: string[];
    let arrayTags: string[] = [''];

    // array de tags que serão procuradas ao pecorrer o metodo.
    arrayTagFrom = ["p:outputPanel", "h:outputLabel", "h:inputText", "p:commandButton", "p:commandLink"];

    
 while(strHtml.search(/\s\s+ /gm) > 0){ // enquanto existir espaçamentos entre as tags substitua por " "
      strHtml = strHtml.replace(/\s\s+ /gm, " ");
    }
    // dentro do arquivo carregado procurar por ">" fechamentos de tag, ao encontrar retire e quebre a linha. 
    // uma maneira encontrada para separar e alinhar os fechamentos das tags 
    arrayTag = strHtml.split(">");
    arrayTag.forEach(element => {

      // adiciona os fechamentos de forma correta concatenando.
      element = element.concat(">");
      arrayTags.push(element);
    });

    // enquanto existir cases a serem realizados execute.
    arrayTags.forEach(element => {
      strTag = element;
      
      var x: number = 1;
      arrayTagFrom.forEach(element2 => {
        var next :string = "";
        if (element.indexOf(element2) != -1) {
          switch (x) {
            case 1:
              next = this.convDiv(strTag);
              break;
            case 2:
              next = this.convLabel(strTag);
              break;
            case 3:
              next = this.convInput(strTag);
              break;
            case 4:
              next = this.convButton(strTag);
              break;
            case 5:
              next = this.convLink(strTag);
              break;
            
          }
            // adicione o resultado a cada ciclo.
          strHtmlConvertido = strHtmlConvertido.concat(next);
         
        }
        x++;
      });
    });


    strHtmlConvertido.trim(); // retira os espaços do conteudo.
    this.content = strHtmlConvertido; // passa o valor para a variavel global que será utilizada para gerar o arquivo do botão do download

    alert("Finalizado!");
    // document.getElementById("mostraHtml").style.display = "block";
   
  }

  convButton(html: string): string {

    var valorTagStyle = "";
    var valorTagStyleClass = "";
    var valorId = "";
    var valorOnClick = "";
    var valorTagValue = "";

    var regxStyleClassApas = /styleClass\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica styleClass="conteudo"
    var regxValueApas = /value\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica value="conteudo"
    var regxValue = /value\s*=*\s*/; //identifica value=
    var regxStyleApas = /style\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica style="conteudo"
    var regxStyle = /style\s*=*\s*/; //identifica style=
    var regxIdApas = /id\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica Id="conteudo"
    var regxonclickApas = /onclick\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica onclick="conteudo"

    if (html !== null) {

      if (html.match(regxValueApas) !== null) { //verifica se tem value

        valorTagValue = this.pegaConteudo(html, regxValueApas, regxValue);
      }

      if (html.match(regxIdApas) !== null) { //verifica se tem id
        var arrId = regxIdApas.exec(html);
        valorId = " " + arrId[0];
      }

      if (html.match(regxStyleApas) !== null) { //verifica se tem style
        var arrStyle = regxStyleApas.exec(html);
        valorTagStyle = " " + arrStyle[0];
      }

      if (html.match(regxonclickApas) !== null) { //verifica se tem onclick
        var arrOnClicklang = regxonclickApas.exec(html);
        valorOnClick = " " + arrOnClicklang[0];
        valorOnClick = valorOnClick.replace("onclick","(click)");
      }

      if (html.match(regxStyleClassApas) !== null) { //verifica se tem styleClass
        var arrStyleClass = regxStyleClassApas.exec(html);
        valorTagStyleClass = " " + arrStyleClass[0];
        valorTagStyleClass = valorTagStyleClass.replace("styleClass", "class");
      }
      
      // procura a cada regex e substitua e devolva na varieavel tagCorreta.
      var tagCorreta = "<button" + valorOnClick + valorId + valorTagStyleClass + " " + valorTagStyle + ">" + valorTagValue + "</button>"
      return tagCorreta;

    } else {
      html = "Error";
      return html;
    }
  }

  convLink(html: string): string {
    var valorTagStyle = "";
    var valorTagStyleClass = "";
    var valorHrefLang = "";
    var valorRel = "";
    var valorRev = "";
    var valorTarget = "";
    var valorId = "";
    var valorTagValue = "";
    var valorOnClick = "";

    var regxStyleClassApas = /styleClass\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica styleClass="conteudo"
    var regxValueApas = /value\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica value="conteudo"
    var regxValue = /value\s*=*\s*/; //identifica value=
    var regxStyleApas = /style\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica style="conteudo"
    var regxStyle = /style\s*=*\s*/; //identifica style=
    var regxRelApas = /rel\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica Rel="conteudo"
    var regxRevApas = /rev\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica Rev="conteudo"
    var regxValorTargetApas = /target\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica target="conteudo"
    var regxValorHrefLangApas = /hreflang\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica hreflang="conteudo"
    var regxIdApas = /id\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica Id="conteudo"
    var regxonclickApas = /onclick\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica onclick="conteudo"

    if (html !== null) {

      if (html.match(regxValueApas) != null) { //verifica se tem value
        valorTagValue = this.pegaConteudo(html, regxValueApas, regxValue);
      }

      if (html.match(regxonclickApas) !== null) { //verifica se tem onclick
        var arrOnClicklang = regxonclickApas.exec(html);
        valorOnClick = " " + arrOnClicklang[0];
      }

      if (html.match(regxValorHrefLangApas) !== null) { //verifica se tem hreflang
        var arrStyleHreflang = regxValorHrefLangApas.exec(html);
        valorHrefLang = " " + arrStyleHreflang[0];
      }

      if (html.match(regxIdApas) !== null) { //verifica se tem id
        var arrId = regxIdApas.exec(html);
        valorId = " " + arrId[0];
      }

      if (html.match(regxRevApas) !== null) { //verifica se tem rev
        var arrStyleRev = regxRevApas.exec(html);
        valorRev = " " + arrStyleRev[0];
      }
      if (html.match(regxValorTargetApas) !== null) { //verifica se tem target
        var arrStyleTarget = regxValorTargetApas.exec(html);
        valorTarget = " " + arrStyleTarget[0];
      }
      if (html.match(regxStyleApas) !== null) { //verifica se tem style
        var arrStyle = regxStyleApas.exec(html);
        valorTagStyle = " " + arrStyle[0];
      }

      if (html.match(regxRelApas) !== null) { //verifica se tem rel
        var arrStyleRel = regxRelApas.exec(html);
        valorRel = " " + arrStyleRel[0];
      }

      if (html.match(regxStyleClassApas) !== null) { //verifica se tem styleClass

        var arrStyleClass = regxStyleClassApas.exec(html);
        valorTagStyleClass = " " + arrStyleClass[0];
        valorTagStyleClass = valorTagStyleClass.replace("styleClass", "class");

      }

      // procura a cada regex e substitua e devolva na varieavel tagCorreta.
      var tagCorreta = "<a" + valorOnClick + valorId + valorTarget + valorRel + valorRev + valorHrefLang + valorTagStyleClass + " " + valorTagStyle + ">" + valorTagValue + "</a>"
      return tagCorreta;
    } else {

      html = "Error";
      return html;
    }

  }

  convLabel(html: string): string {
    var valorTagValue = "";
    var valorTagStyle = "";
    var valorTagStyleClass = "";
    var valorTagId = "";

    var regxValueApas = /value\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica value="conteudo"
    var regxValue = /value\s*=*\s*/; //identifica value=
    var regxStyleAspas = /style\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica style="conteudo"
    var regxIdAspas = /id\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica id="conteudo"
    var regxStyleClassApas = /styleClass\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica styleClass="conteudo"

    if (html.match(regxValueApas) != null) { //verifica se tem value
      valorTagValue = this.pegaConteudo(html, regxValueApas, regxValue);

      if (html.match(regxStyleAspas) !== null) { //verifica se tem style
        var arrStyle = regxStyleAspas.exec(html);
        valorTagStyle = " " + arrStyle[0];
      }

      if (html.match(regxStyleClassApas) !== null) { //verifica se tem styleClass
        var arrStyleClass = regxStyleClassApas.exec(html);
        valorTagStyleClass = " " + arrStyleClass[0];
        valorTagStyleClass = valorTagStyleClass.replace("styleClass", "class");
      }

      if (html.match(regxIdAspas) !== null) { //verifica se tem id
        var arrId = regxIdAspas.exec(html);
        valorTagId = " " + arrId[0];
      }

    }

     // procura a cada regex e substitua e devolva na varieavel html.
    html = '<label' + valorTagStyle + valorTagStyleClass + valorTagId + '>' + valorTagValue + '</label>';
    return html;
  }

  // pegar o valor de um atributo value dentro da tag e 
  // retorna entra as tags de abertura e fechamento
  pegaConteudo(html: string, regxToFindAspas, regxToFind): string {

    var regxEspaco = /\s/g;

    var pegaValue = regxToFind.exec(html);
    pegaValue[0] = pegaValue[0].replace(regxEspaco, ""); // elemina todos os espaços entre tags.
    var html = html.replace(regxToFind, pegaValue[0]);

    var novoRegx = regxToFindAspas.exec(html);
    var indexValue = novoRegx[0].indexOf("value");
    var sbStrValue = novoRegx[0].substring(indexValue + 7, novoRegx[0].length - 1);

    return sbStrValue;
  }

  convInput(html: string): string {

    var regxInputText = /h:inputText\s*/; //identifica p:inputText
    var regxRendered = /rendered\s*=*\s*/; //identifica rendered
    var regxBinding = /\s*binding\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica binding
    var regxConverter = /\s*converter\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica converter
    var regxImmediate = /\s*immediate\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica immediate
    var regxValidator = /\s*validator\s*=*\s*(["'])(?:(?=(\\?))\2.)*?\1/; //identifica validator
    var regxStyleClass = /styleClass\s*=*\s*/; //identifica styleClass

    html = html.replace(regxInputText, "input "); // troca todos os inputText por input

    if (html.search(regxRendered) || html.search(regxBinding) || html.search(regxConverter) ||
      html.search(regxImmediate) || html.search(regxValidator) || regxStyleClass !== null) {

      html = html.replace(regxRendered, "*ngIf="); // troca todos os rendered por ngIf=
      html = html.replace(regxBinding, ""); 
      html = html.replace(regxConverter, "");
      html = html.replace(regxImmediate, "");
      html = html.replace(regxValidator, "");
      html = html.replace(regxStyleClass, "class="); //troca todos os styleClass por class=

    }
    return html;
  }

  convDiv(html: string): string {  //responsavel por trocar conteudo dentro das div
    html = html.replace("p:outputPanel", "div");
    html = html.replace("styleClass", "class");
    html = html.replace("rendered", "*ngIf");
    return html;
  }

}