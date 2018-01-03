declare module 'react-focus-lock' {
    import * as React from 'react';

    interface Props {
        disabled?: boolean;
        /**
         * will return focus to the previous position on trap disable.
         */
        returnFocus?: boolean;
        /**
         * enables(or disables) text selection. This also allows not to have ANY focus.
         */
        allowTextSelection?: boolean;
        /**
         * disables hidden inputs before and after the lock.
         */
        noFocusGuards?: boolean;

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
     * Autofocus on children
     */
    export class AutoFocusInside extends React.Component<AutoFocusProps> {}
}