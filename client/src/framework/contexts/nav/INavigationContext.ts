import React from "react";

interface INavigationContext {
	show(): void;
	close(): void;
	toggle(): void;
	addRefsActiveNavigation(...refs: React.RefObject<any>[]): void;
}

export default INavigationContext;
