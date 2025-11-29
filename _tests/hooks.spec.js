import React from 'react';
import {
    render,
    act,
    cleanup,
} from '@testing-library/react';
import {expect} from 'chai';
import sinon from 'sinon';
import {useFocusController, useFocusState} from '../src/UI';

afterEach(cleanup);

describe('Hooks w/o sidecar', () => {
    it('controls focus', async () => {
        let control;
        const ref = React.createRef();
        const Capture = () => {
            control = useFocusController(ref);
            return null;
        };
        render(
            <div ref={ref}>
                <button id="b1">button1</button>
                <button id="b2">button2</button>
                <Capture/>
            </div>,
        );
        expect(document.activeElement).to.be.equal(document.body);
        const p = control.autoFocus();
        // async operation
        expect(document.activeElement).to.be.equal(document.body);
        await act(() => p);
        expect(document.activeElement).to.be.equal(document.getElementById('b1'));
    });

    it('focus tracking', async () => {
        const Capture = ({children, id, ...callbacks}) => {
            const {onFocus, ref, active} = useFocusState(callbacks);
            return (
                <button id={id} onFocus={onFocus} ref={ref}>
                    {children}
                    {active ? '+' : '-'}
                </button>
            );
        };
        const onparentblur = sinon.spy();

        const onfocus = sinon.spy();
        const onblur = sinon.spy();

        const Suite = () => {
            const {onFocus} = useFocusState({onBlur: onparentblur});
            return (
                <>
                    <div onFocus={onFocus}>
                        <Capture id="1">test1</Capture>
                        <Capture id="2" onFocus={onfocus} onBlur={onblur}>test2</Capture>
                        <Capture id="3">test3</Capture>
                    </div>
                    <button id="0"/>
                </>
            );
        };
        const {container} = render(<Suite/>);

        const getText = id => document.getElementById(id).textContent;

        act(() => document.getElementById('1').focus());
        expect(container.innerHTML).to.be.equal('<div><button id="1">test1+</button><button id="2">test2-</button><button id="3">test3-</button></div><button id="0"></button>');
        sinon.assert.notCalled(onfocus);
        sinon.assert.notCalled(onblur);

        act(() => document.getElementById('2').focus());
        expect(container.innerHTML).to.be.equal('<div><button id="1">test1-</button><button id="2">test2+</button><button id="3">test3-</button></div><button id="0"></button>');
        sinon.assert.calledOnce(onfocus);
        sinon.assert.notCalled(onblur);

        act(() => document.getElementById('3').focus());
        expect(container.innerHTML).to.be.equal('<div><button id="1">test1-</button><button id="2">test2-</button><button id="3">test3+</button></div><button id="0"></button>');
        sinon.assert.calledOnce(onfocus);
        sinon.assert.calledOnce(onblur);

        sinon.assert.notCalled(onparentblur);

        act(() => document.getElementById('0').focus());
        expect(container.innerHTML).to.be.equal('<div><button id="1">test1-</button><button id="2">test2-</button><button id="3">test3-</button></div><button id="0"></button>');
        // blur on parent will be called only once, this is important
        sinon.assert.calledOnce(onparentblur);
    });
});
