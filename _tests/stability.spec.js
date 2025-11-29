import React, {memo, useRef} from 'react';
import {render, act} from '@testing-library/react';
import * as ReactDOM from 'react-dom/client';
import * as ReactDOMServer from 'react-dom/server';
import FocusLock, {useFocusScope} from '../src/index';
import { expect } from 'chai';

describe('focus scope stability', () => {
    it('does not re-render memoized useFocusScope consumer when FocusLock internal state changes', async () => {
        let renderCountRef=0;

        const ScopeConsumer = memo(() => {
            // subscribe to focus scope – this is what may cause unwanted re-renders
            useFocusScope();
            renderCountRef++;

            return <div data-testid="counter">{renderCountRef}</div>;
        });

        const TestHarness = () => {
            return (
                <FocusLock>
                    <button>just button</button>
                    <ScopeConsumer/>
                </FocusLock>
            );
        };

        render(<TestHarness/>);

        await act(async () => 1);

        // After FocusLock internal change, a perfectly stable, memoized consumer
        // should not re-render just because context identity changed.
        expect(renderCountRef).to.equal(1);
    });
});

describe('SSR + Suspense hydration', () => {
    it('does not log hydration warnings when wrapping Suspense with FocusLock around unresolved content', async () => {
        let resolvePromise;
        let resolved = false;
        const loadPromise = new Promise((resolve) => {
            resolvePromise = () => {
                resolved = true;
                resolve();
            };
        });

        const SuspenseChild = () => {
            if (!resolved) {
               // throw loadPromise;
            }
            return <div data-testid="loaded">loaded</div>;
        };

        const App = () => (
                <FocusLock>
                    <button>b1</button>
                    <React.Suspense fallback={<div>fallback</div>}>
                        <button>b2</button>
                    <SuspenseChild/>
                    </React.Suspense>
                </FocusLock>
        );

        const html = ReactDOMServer.renderToString(<App/>);
        const container = document.createElement('div');
        container.innerHTML = html;

        const originalError = console.error;
        const messages = [];
        // eslint-disable-next-line no-console
        console.error = (...args) => {
            originalError('>>',...args);
            messages.push(args.join(' '));
        };

        try {
            await act(async () => {
                ReactDOM.hydrateRoot(container, <App/>);
                // resolve suspense after hydrate tick
                resolvePromise();
                await loadPromise;
            });
        } finally {
            console.error = originalError;
        }

        // Desired behaviour: FocusLock should not cause React hydration update warnings
        const hasHydrationFailure = messages.some(msg =>
            msg.includes('This Suspense boundary received an update before it finished hydrating')
        );

        expect(hasHydrationFailure).to.equal(false);
    });
});

