import { trigger, transition, style, animate, query, stagger, animateChild, group, state } from '@angular/animations';

export const secondaryPageAnimations = trigger('secondaryPage', [
    transition('false => true', [
        query(':enter', [
            style({ opacity: 0, transform: 'translateX(100%)' }),
            stagger(30, [
              animate('300ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'none' }))
            ])
        ], { optional: true })
    ]),
    transition('true => false', [
        query(':leave', [
            style({ opacity: 1, transform: 'none' }),
            stagger(30, [
              animate('300ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 0, transform: 'translateX(100%)' }))
            ])
        ], { optional: true })
    ])
]);

// nice stagger effect when showing existing elements
export const listAnimations = trigger('list', [
    transition(':enter', [
        // child animation selector + stagger
        query('@items', 
            stagger(300, animateChild()),
            { optional: true }
        )
    ])
]);

export const listItemsAnimations = trigger('items', [
    // cubic-bezier for a tiny bouncing feel
    transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('1s cubic-bezier(.8,-0.6,0.2,1.5)', style({ transform: 'scale(1)', opacity: 1 }))
    ]),
    transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('1s cubic-bezier(.8,-0.6,0.2,1.5)', style({ transform: 'scale(0.5)', opacity: 0, height: '0px', margin: '0px' }))
    ]),     
]);

export const rotateInOutAnimation = trigger('rotateInOut', [
	transition(':enter', [
		style({ opacity: 0, transform: 'rotate(-180deg)' }),
		animate('250ms ease-out', style({ opacity: 1, transform: 'rotate(0deg)' })),
	]),
	transition(':leave', [
		animate('250ms ease-in', style({ opacity: 0, transform: 'rotate(180deg)' })),
	])
]);

export const showHideBottomAnimation = trigger('showHideBottom', [
    state('true', style({
        visibility: 'visible'
    })),
    state('false', style({
        visibility: 'hidden'
    })),
    transition('true => false', [
        style({ transform: 'none' }),
		animate('150ms linear', style({ transform: 'translateY(100%)' })),
    ]),
    transition('false => true', [
        style({ visibility: 'visible', transform: 'translateY(100%)' }),
		animate('150ms linear', style({ visibility: 'visible' ,transform: 'none' })),
    ])
]);