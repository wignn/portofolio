<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	let {
		class: className,
		children,
		...props
	}: {
		class?: string;
		children?: Snippet;
		[key: string]: any;
	} = $props();
</script>

<div
	class={cn('rounded-xl border bg-card text-card-foreground shadow', className)}
	{...props}
>
	{@render children?.()}
</div>
