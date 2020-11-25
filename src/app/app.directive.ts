import { Directive, Input, Inject, Renderer2, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppService } from './app.service';
import { CUSTOM_THEME } from './app.model';

@Directive({
  selector: '[themeChange]'
})
export class AppDirective {

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }

  @Input("themeName") themeName: string;
  
  @HostListener('click', ['$event']) onClick() {
    let theme;
    if (!this.themeName) {
      theme = CUSTOM_THEME;
      this.themeName = theme.name;
    }
    if (AppService.themeName !== this.themeName) {
      if (theme) {
        this.customeThemeSet(theme);
      }
      this.renderer.removeClass(this.document.body, AppService.themeName);
      this.renderer.addClass(this.document.body, this.themeName);
      AppService.themeName = this.themeName;
    }
  }

  private customeThemeSet (theme) {
    const head = this.renderer.selectRootElement(this.document.head, true);
    // const rStyle = head.querySelector(`#${theme.name}`);
    // if(rStyle) {
      let css = `body.${theme.name} { `;
      for (const key in theme.properties) {
        css += `${key} : ${theme.properties[key]}; `;
      }
      css += " }";
      const style = this.renderer.createElement("style");
      style.type = 'text/css';
      style.id = theme.name;
      style.appendChild(this.renderer.createText(css));
      head.appendChild(style);
    // }
    
  }


}
