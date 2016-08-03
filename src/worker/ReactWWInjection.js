/**
 * Injecting the renderer's needed dependencies into React's internals.
 */
import ReactInjection from 'react/lib/ReactInjection';
import ReactComponentEnvironment from 'react/lib/ReactComponentEnvironment';
import ReactDOMFeatureFlags from 'react/lib/ReactDOMFeatureFlags'
import ReactDefaultBatchingStrategy from 'react/lib/ReactDefaultBatchingStrategy';

import ReactWWReconcileTransaction from './ReactWWReconcileTransaction';
import ReactWWComponent from './ReactWWComponent';
import ReactWWTextComponent from './ReactWWTextComponent';


import {
    processChildrenUpdates, replaceNodeWithMarkupByID
}
from './ReactWWChildOperations';

export default function inject() {

    (ReactInjection.NativeComponent || ReactInjection.HostComponent).injectGenericComponentClass(
        ReactWWComponent
    );
    (ReactInjection.NativeComponent || ReactInjection.HostComponent).injectTextComponentClass(
        ReactWWTextComponent
    );

    ReactInjection.Updates.injectReconcileTransaction(
        ReactWWReconcileTransaction
    );

    ReactInjection.Updates.injectBatchingStrategy(
        ReactDefaultBatchingStrategy
    );

    ReactComponentEnvironment.processChildrenUpdates = processChildrenUpdates;
    ReactComponentEnvironment.replaceNodeWithMarkupByID = replaceNodeWithMarkupByID
}
