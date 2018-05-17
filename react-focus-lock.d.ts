declare module 'react-focus-lock' {
    import * as React from 'react';

    interface Props {
        disabled?: boolean;

        /**
         * will return focus to the previous position on trap disable.
         */
        returnFocus?: boolean;

        /**
         * @deprecated Use persistentFocus=false instead
         * enables(or disables) text selection. This also allows not to have ANY focus.
         */
        allowTextSelection?: boolean;

        /**
         * enables of disables "sticky" behavior, when any focusable element shall be focused.
         * This disallow any text selection on the page.
         * @default false
         */
        persistentFocus?: boolean;

        /**
         * enables or disables autoFocusing feature.
         * If enabled - will move focus inside Lock, selecting the first or autoFocusable element
         * If disable - will blur any focus on Lock activation.
         * @default true
         */
        autoFocus?: boolean;

        /**
         * disables hidden inputs before and after the lock.
         */
        noFocusGuards?: boolean;
        
        /**
         * named focus group for focus scattering aka combined lock targets
         */
        group?: string;

        children: React.ReactNode
    }

    interface AutoFocusProps {
        children: React.ReactNode
    }

    /**
     * Traps Focus inside a Lock
     */
    export default class ReactFocusLock extends React.Component<Props> {}

    /**
     * Autofocus on children on Lock activation
     */
    export class AutoFocusInside extends React.Component<AutoFocusProps> {}

    /**
     * Autofocus on children
     */
    export class MoveFocusInside extends React.Component<AutoFocusProps> {}
}
