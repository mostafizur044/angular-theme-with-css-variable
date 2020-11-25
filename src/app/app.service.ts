import { Injectable, Renderer2, EventEmitter, OnDestroy, Inject, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { DOCUMENT } from '@angular/common';
import { CUSTOM_THEME } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class AppService implements OnDestroy{

  static themeName: string;
  themeEvent: EventEmitter<string> = new EventEmitter();
  private _unsubsribe: Subject<any>;
  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) { 
    this._unsubsribe = new Subject();
    this.renderer = rendererFactory.createRenderer(null, null);

    this.themeEvent.pipe(takeUntil(this._unsubsribe))
    .subscribe(
      (val: string) => {
        this.changeTheme(val);
      }
    );
  }
  
  private changeTheme (themeName) {
    let theme;
    if (!themeName) {
      theme = CUSTOM_THEME;
      themeName = theme.name;
    }

    if (AppService.themeName !== themeName) {
      if (theme) {
        this.customeThemeSet(theme);
      }
      this.renderer.removeClass(this.document.body, AppService.themeName);
      this.renderer.addClass(this.document.body, themeName);
      AppService.themeName = themeName;
    }
  }

  private customeThemeSet (theme) {
    const head = this.renderer.selectRootElement(this.document.head, true);
    // const rStyle = head.querySelector(`#${theme.name}`);
    // debugger
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
  }
  
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }
}
