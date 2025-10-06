export class ReadUserCountResponseDto {
  userCountTotal: number;
  userCountAssociations: number;
  userCountBrands: number;
  userCountDJs: number;
  userCountEventOrganizers: number;
  userCountFans: number;
  userCountFreestylers: number;
  userCountMCs: number;
  userCountMedia: number;
  userCountAdministrative: number;
  userCountNonAdministrative: number;

  constructor(
    userCountTotal: number,
    userCountAssociations: number,
    userCountBrands: number,
    userCountDJs: number,
    userCountEventOrganizers: number,
    userCountFans: number,
    userCountFreestylers: number,
    userCountMCs: number,
    userCountMedia: number,
    userCountAdministrative: number,
    userCountNonAdministrative: number
  ) {
    this.userCountTotal = userCountTotal;
    this.userCountAssociations = userCountAssociations;
    this.userCountBrands = userCountBrands;
    this.userCountDJs = userCountDJs;
    this.userCountEventOrganizers = userCountEventOrganizers;
    this.userCountFans = userCountFans;
    this.userCountFreestylers = userCountFreestylers;
    this.userCountMCs = userCountMCs;
    this.userCountMedia = userCountMedia;
    this.userCountAdministrative = userCountAdministrative;
    this.userCountNonAdministrative = userCountNonAdministrative;
  }
}
