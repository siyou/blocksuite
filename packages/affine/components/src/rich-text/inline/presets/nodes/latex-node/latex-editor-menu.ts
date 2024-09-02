import type { BaseTextAttributes } from '@blocksuite/inline/index';
import type { Y } from '@blocksuite/store';

import { ColorScheme } from '@blocksuite/affine-model';
import { ThemeObserver } from '@blocksuite/affine-shared/theme';
import { ShadowlessElement, WithDisposable } from '@blocksuite/block-std';
import { noop } from '@blocksuite/global/utils';
import { DoneIcon } from '@blocksuite/icons/lit';
import { DocCollection } from '@blocksuite/store';
import {
  type Signal,
  SignalWatcher,
  effect,
  signal,
} from '@lit-labs/preact-signals';
import { cssVar } from '@toeverything/theme';
import { css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type ThemedToken, codeToTokensBase } from 'shiki';
import { z } from 'zod';

import type { AffineLatexNode } from './latex-node.js';

import { InlineManager } from '../../../inline-manager.js';

@customElement('latex-editor-menu')
export class LatexEditorMenu extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {
  static override styles = css`
    .latex-editor-container {
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-rows: auto auto;
      grid-template-areas:
        'editor-box confirm-box'
        'hint-box hint-box';

      padding: 8px;
      border-radius: 8px;
      border: 0.5px solid ${unsafeCSS(cssVar('borderColor'))};
      background: ${unsafeCSS(cssVar('backgroundOverlayPanelColor'))};

      /* light/toolbarShadow */
      box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.14);
    }

    .latex-editor {
      grid-area: editor-box;
      width: 280px;
      padding: 4px 10px;

      border-radius: 4px;
      background: ${unsafeCSS(cssVar('white10'))};

      /* light/activeShadow */
      box-shadow: 0px 0px 0px 2px rgba(30, 150, 235, 0.3);

      font-family: ${unsafeCSS(cssVar('fontCodeFamily'))};
    }
    .latex-editor:focus-within {
      border: 1px solid ${unsafeCSS(cssVar('blue700'))};
    }

    .latex-editor-confirm {
      grid-area: confirm-box;
      display: flex;
      align-items: flex-end;
      padding-left: 10px;
    }

    .latex-editor-hint {
      grid-area: hint-box;
      padding-top: 6px;

      color: ${unsafeCSS(cssVar('placeholderColor'))};

      /* MobileTypeface/caption */
      font-family: 'SF Pro Text';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px; /* 133.333% */
      letter-spacing: -0.24px;
    }
  `;

  highlightTokens$: Signal<ThemedToken[][]> = signal([]);

  readonly inlineManager = new InlineManager<
    BaseTextAttributes & {
      'latex-editor-unit'?: null;
    }
  >();

  yText!: Y.Text;

  private _updateHighlightTokens(text: string) {
    const theme =
      ThemeObserver.instance.mode$.value === ColorScheme.Dark
        ? 'dark-plus'
        : 'light-plus';

    codeToTokensBase(text, {
      lang: 'latex',
      theme,
    })
      .then(token => {
        this.highlightTokens$.value = token;
      })
      .catch(console.error);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    const doc = new DocCollection.Y.Doc();
    this.yText = doc.getText('latex');
    this.yText.insert(0, this.latexSignal.value);

    const yTextObserver = () => {
      const text = this.yText.toString();
      this.latexSignal.value = text;

      this._updateHighlightTokens(text);
    };
    this.yText.observe(yTextObserver);
    this.disposables.add(() => {
      this.yText.unobserve(yTextObserver);
    });

    this.disposables.add(
      effect(() => {
        noop(this.highlightTokens$.value);
        this.richText?.inlineEditor?.requestUpdate();
      })
    );

    this.disposables.add(
      ThemeObserver.subscribe(() => {
        this._updateHighlightTokens(this.yText.toString());
      })
    );

    this.inlineManager.registerSpecs([
      {
        name: 'latex-editor-unit',
        schema: z.undefined(),
        match: () => true,
        renderer: ({ delta }) => {
          return html`<latex-editor-unit .delta=${delta}></latex-editor-unit>`;
        },
      },
    ]);

    this.disposables.addFromEvent(this, 'keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        this.abortController.abort();
      }
    });

    setTimeout(() => {
      this.richText?.inlineEditorContainer.focus();
      this.richText?.inlineEditor?.focusEnd();
    });
  }

  override render() {
    return html`<div class="latex-editor-container">
      <div class="latex-editor">
        <rich-text
          .yText=${this.yText}
          .attributesSchema=${this.inlineManager.getSchema()}
          .attributeRenderer=${this.inlineManager.getRenderer()}
        ></rich-text>
      </div>
      <div class="latex-editor-confirm">
        ${DoneIcon({
          width: '24',
          height: '24',
        })}
      </div>
      <div class="latex-editor-hint">Shift Enter to line break</div>
    </div>`;
  }

  get richText() {
    return this.querySelector('rich-text');
  }

  @property({ attribute: false })
  accessor abortController!: AbortController;

  @property({ attribute: false })
  accessor latexSignal!: AffineLatexNode['latex$'];
}

declare global {
  interface HTMLElementTagNameMap {
    'latex-editor-menu': LatexEditorMenu;
  }
}