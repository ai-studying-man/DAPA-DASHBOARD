import fleet from './fleet-assets.json' with {type:'json'};
import verified from './verified-photos.json' with {type:'json'};

// Generated modeling references remain in the authoring catalog only.
export const publicFleet=fleet.map(entry=>{
  const photo=verified[entry.id]||entry;
  return {...entry,referencePhoto:photo.referenceKind==='public-photo'?photo.referencePhoto:null,
    referenceKind:photo.referenceKind==='public-photo'?'public-photo':'pending',
    referenceUrl:photo.referenceUrl,photoCredit:photo.referenceKind==='public-photo'?photo.photoCredit:null,
    photoLicenseUrl:photo.photoLicenseUrl};
});
export const publicEquipment=new Map(publicFleet.map(entry=>[entry.id,entry]));
