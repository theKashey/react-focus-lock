import { FC, Component, RefObject, FocusEventHandler } from 'react';
import {ReactFocusLockProps, AutoFocusProps, FreeFocusProps, InFocusGuardProps} from "./interfaces.js";

export {ReactFocusLockProps};
/**
 * Traps Focus inside a Lock
 */
declare const ReactFocusLock: FC<ReactFocusLockProps>;

export default ReactFocusLock;

/**
 * Autofocus on children on Lock activation
 */
export class AutoFocusInside extends Component<AutoFocusProps> {
}

/**
 * Autofocus on children
 */
export class MoveFocusInside extends Component<AutoFocusProps> {
}

/**
 * Allow free focus inside on children
 */
export class FreeFocusInside extends Component<FreeFocusProps> {
}

/**
 * Secures the focus around the node
 */
export class InFocusGuard extends Component<InFocusGuardProps> {
}

/**
 * Moves focus inside a given node
 */
export function useFocusInside(node: RefObject<HTMLElement>): void;

export type FocusOptions = {
    /**
     * enables focus cycle
     * @default true
     */
    cycle?: boolean;
    /**
     * limits focusables to tabbables (tabindex>=0) elements only
     * @default true
     */
    onlyTabbable?:boolean
}

export type FocusControl = {
    /**
     * moves focus to the current scope, can be considered as autofocus
     */
    autoFocus():Promise<void>;
    /**
     * focuses the next element in the scope.
     * If active element is not in the scope, autofocus will be triggered first
     */
    focusNext(options?:FocusOptions):Promise<void>;
    /**
     * focuses the prev element in the scope.
     * If active element is not in the scope, autofocus will be triggered first
     */
    focusPrev(options?:FocusOptions):Promise<void>;
    /**
     * focused the first element in the scope
     */
    focusFirst(options?: Pick<FocusOptions,'onlyTabbable'>):Promise<void>;
    /**
     * focused the last element in the scope
     */
    focusLast(options?: Pick<FocusOptions,'onlyTabbable'>):Promise<void>;
}


/**
 * returns FocusControl over the union given elements, one or many
 * - can be used outside of FocusLock
 * - can accept HTML elements or React Refs
 * @see {@link useFocusScope} for use cases inside of FocusLock
 */
export function useFocusController<Elements extends HTMLElement=HTMLElement>(...shards: ReadonlyArray<HTMLElement | {current:HTMLElement | null}>):FocusControl;

/**
 * returns FocusControl over the current FocusLock
 * - can be used only within FocusLock
 * - can be used by disabled FocusLock
 * @see {@link useFocusController} for use cases outside of FocusLock
 */
export function useFocusScope():FocusControl

export type FocusCallbacks = {
    onFocus():void;
    onBlur():void;
}
/**
 * returns information about FocusState of a given node
 * @example
 * ```tsx
 * const {active, ref, onFocus} = useFocusState();
 * return <div ref={ref} onFocus={onFocus}>{active ? 'is focused' : 'not focused'}</div>
 * ```
 */
export function useFocusState<T extends Element>(callbacks?: FocusCallbacks ):{
    /**
     * is currently focused, or is focus is inside
     */
    active: boolean;
    /**
     * focus handled. SHALL be passed to the node down
     */
    onFocus: FocusEventHandler<T>;
    /**
     * reference to the node
     * only required to capture current status of the node
     */
    ref: RefObject<T>;
}
