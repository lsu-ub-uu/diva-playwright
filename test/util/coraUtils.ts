import type { DataAtomic, DataGroup } from "./coraTypes";


export function getFirstChildWithNameInData(
  dataGroup: DataGroup,
  nameInData: string,
) {
  if (dataGroup.children.length === 0) {
    throw new Error(
      `DataGroup with name [${dataGroup.name}] does not have any children`,
    );
  }

  const matchingChild = dataGroup.children.find((child) => {
    return child.name === nameInData;
  });

  if (matchingChild === undefined) {
    throw new Error(`Child with name [${nameInData}] could not be found`);
  }

  return matchingChild;
}


export function getAllChildrenWithNameInData(
  dataGroup: DataGroup,
  nameInData: string,
) {
  const childrenToReturn = dataGroup.children.filter((child) => {
    return child.name === nameInData;
  });

  return childrenToReturn;
}


export function getFirstDataAtomicValueWithNameInData(
  dataGroup: DataGroup,
  nameInData: string,
): string {
  const dataAtomic = getFirstDataAtomicWithNameInData(dataGroup, nameInData);

  return dataAtomic.value;
}


export function getFirstDataAtomicWithNameInData(
  dataGroup: DataGroup,
  nameInData: string,
): DataAtomic {
  if (dataGroup.children.length === 0) {
    throw new Error(
      `DataGroup with name [${dataGroup.name}] does not have any children`,
    );
  }

  const dataAtomics = <DataAtomic[]>dataGroup.children.filter((child) => {
    return Object.hasOwn(child, 'value');
  });

  const firstMatchingDataAtomic = dataAtomics.find((dataAtomic) => {
    return dataAtomic.name === nameInData;
  });

  if (firstMatchingDataAtomic === undefined) {
    throw new Error(
      `DataGroup with name [${dataGroup.name}] does not have atomic child with name [${nameInData}]`,
    );
  }

  return firstMatchingDataAtomic;
}

export function getFirstDataGroupWithNameInData(
  dataGroup: DataGroup,
  nameInData: string,
): DataGroup {
  const dataGroups = <DataGroup[]>dataGroup.children.filter((child) => {
    return Object.hasOwn(child, 'children');
  });

  const firstMatchingDataGroup = dataGroups.find((child) => {
    return child.name === nameInData;
  });

  if (firstMatchingDataGroup === undefined) {
    throw new Error(`Child with name [${nameInData}] does not exist`);
  }

  return firstMatchingDataGroup;
}