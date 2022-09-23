export function sortDependencyArray<T>(unsortedItems: readonly T[], getDependencies: (item: T) => T[]): T[] | null {
    const itemsToSort = [...unsortedItems];
    const itemsThatHaveBeenSorted = new Set<T>();
    const sortedItems: T[] = [];

    // For each item, store what item it is dependent on, for easy access.
    const dependenciesByItem = new Map(
        itemsToSort.map(item => [item, getDependencies(item)])
    )

    // A dependency is satisfied if it's already in itemsThatHaveBeenSorted (and is therefore in sortedItems).
    const areAllDependenciesSatisfied = (item: T) => {
        const dependentOn = dependenciesByItem.get(item);
        if (!dependentOn) {
            return true;
        }

        return dependentOn.every(dependency => itemsThatHaveBeenSorted.has(dependency));
    }

    // Loop over the unsorted items until none are left, or we do nothing over a whole iteration.
    while (true) {
        let sortedAny = false;

        for (let iItem = 0; iItem < itemsToSort.length; iItem++) {
            const item = itemsToSort[iItem];

            // When an item's dependencies are all satisfied, add it to the sorted output.
            if (areAllDependenciesSatisfied(item)) {
                sortedAny = true;
                itemsThatHaveBeenSorted.add(item);
                sortedItems.push(item);

                // Remove this item from the array still needing sorted.
                itemsToSort.splice(iItem, 1);
                iItem--;
            }
        }

        // If no items are left to sort, we've determined a valid sort order.
        if (itemsToSort.length === 0) {
            return sortedItems;
        }

        // If a complete iteration finds no item that is safe to add to the sorted output, we have a problem.
        if (sortedAny === false) {
            return null;
        }
    }
}
