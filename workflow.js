(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MadarWorkflow=api;})(typeof window!=='undefined'?window:this,()=>{
  const groups=[
    {id:'preparation',name:'📱 آماده‌سازی اپ',color:'#6386c3',items:[['release-file','Release APK یا AAB'],['keystore','امضای دیجیتال با Keystore'],['app-name','نام اپ'],['package-name','Package Name'],['version','Version Name / Version Code'],['app-icon','آیکون اپ'],['splash','Splash Screen در صورت نیاز',true],['cleanup','حذف Debug logs و اطلاعات تست'],['devices','تست نهایی روی چند دستگاه']]},
    {id:'product',name:'🛒 اطلاعات صفحه محصول',color:'#9c7dbb',items:[['title','عنوان اپ'],['short-description','توضیح کوتاه'],['full-description','توضیحات کامل'],['store-icon','آیکون صفحه محصول'],['screenshots','چند Screenshot از اپ'],['category','دسته‌بندی'],['keywords','کلمات کلیدی / برچسب‌ها در صورت وجود',true],['developer','اطلاعات سازنده / توسعه‌دهنده']]},
    {id:'privacy',name:'🔐 حریم خصوصی و مجوزها',color:'#5c9a92',items:[['policy','Privacy Policy'],['data','اطلاعاتی که اپ جمع‌آوری یا ذخیره می‌کند'],['permissions','بررسی Permissionهای اپ'],['remove-permissions','حذف Permissionهای غیرضروری'],['sdk','مشخص کردن سرویس‌ها و SDKهای شخص ثالث']]},
    {id:'monetization',name:'💰 قیمت و درآمد',color:'#aa955d',optional:true,items:[['price','تعیین قیمت',true],['model','مدل درآمدی',true],['iap','خرید درون‌برنامه‌ای، در صورت استفاده',true],['ads','تبلیغات، در صورت استفاده',true]]},
    {id:'finaltest',name:'🧪 تست نهایی',color:'#d49a53',items:[['install','Install — نصب اپ'],['login','Register / Login — ثبت‌نام و ورود'],['features','استفاده از تمام قابلیت‌های اصلی'],['reopen','بستن و باز کردن اپ'],['offline','قطع اینترنت'],['language','تغییر زبان'],['theme','تغییر Theme'],['reinstall','حذف و نصب مجدد'],['crash','بررسی Crash']]},
    {id:'publication',name:'🚀 انتشار',color:'#5e9a75',items:[['build','Build Release'],['upload','Upload — آپلود'],['market','تکمیل اطلاعات مارکت'],['review','ارسال برای بررسی'],['publish','انتشار']]}
  ];
  const entries=groups.flatMap(g=>g.items.map(([id,title,optional])=>({id:g.id+'.'+id,title,optional:!!optional,group:g.id})));
  const entry=id=>entries.find(x=>x.id===id);
  const blank=()=>Object.fromEntries(entries.map(x=>[x.id,{status:'pending',note:''}]));
  function valid(value){return value===undefined||(value&&typeof value==='object'&&!Array.isArray(value)&&Object.entries(value).every(([id,v])=>entry(id)&&v&&['pending','done','na'].includes(v.status)&&(v.status!=='na'||entry(id).optional)&&typeof v.note==='string'&&v.note.length<=2000));}
  function normalize(value){return {...blank(),...(value||{})};}
  function summary(project,group){const items=group?entries.filter(x=>x.group===group):entries;const applicable=items.filter(x=>project.checklist[x.id].status!=='na');const done=applicable.filter(x=>project.checklist[x.id].status==='done').length;return {done,total:applicable.length,skipped:items.length-applicable.length,percent:applicable.length?Math.round(done/applicable.length*100):0};}
  const legacy={idea:'preparation',design:'preparation',development:'preparation',testing:'finaltest',released:'publication'};
  function migrate(project){project.checklist=normalize(project.checklist);if(legacy[project.stage])project.stage=legacy[project.stage];return project;}
  return {groups,entries,entry,blank,valid,normalize,summary,migrate,legacy};
});
