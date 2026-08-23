'use client'
import { useState } from 'react'
import { T, E, COLORS, CATEGORIES, DAY_LABELS } from '@/lib/constants'
import { NeuBtn, NeuToggle } from '@/components/ui/Neu'
import type { Habit, HabitInsert } from '@/lib/types'

function Icon({ id, size=16, color='currentColor' }: { id:string;size?:number;color?:string }) {
  const icons:Record<string,React.ReactNode>={
    droplet:<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2.5a.75.75 0 01.6.3l5.4 7.2a5.25 5.25 0 11-12 0l5.4-7.2a.75.75 0 01.6-.3z"/></svg>,
    bolt:<svg viewBox="0 0 20 20" fill="currentColor"><path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z"/></svg>,
    book:<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 16.82A7.462 7.462 0 0115 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0018 15.06v-11a.75.75 0 00-.546-.721A9.006 9.006 0 0015 3a8.963 8.963 0 00-4.25 1.065V16.82zM9.25 4.065A8.963 8.963 0 005 3c-.85 0-1.673.118-2.454.339A.75.75 0 002 4.06v11a.75.75 0 00.954.721A7.506 7.506 0 015 15.5c1.579 0 3.042.487 4.25 1.32V4.065z"/></svg>,
    moon:<svg viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>,
    heart:<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-2.184C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.953a22.049 22.049 0 01-3.744 2.876l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z"/></svg>,
    brain:<svg viewBox="0 0 20 20" fill="currentColor"><path d="M7.5 3a3.5 3.5 0 00-3.456 4.043A3.502 3.502 0 005.5 14H7v1.5a1.5 1.5 0 003 0V6a3.5 3.5 0 00-2.5-3.354V3zm5 0v-.354A3.5 3.5 0 0115 6v8a3.5 3.5 0 01-1.456 2.843A3.5 3.5 0 0110 13v1.5a1.5 1.5 0 003 0V14h1.5a3.502 3.502 0 001.456-6.957A3.5 3.5 0 0012.5 3z"/></svg>,
    dumbbell:<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 4a1 1 0 00-1 1v1H4a1 1 0 000 2h1v4H4a1 1 0 000 2h1v1a1 1 0 002 0v-1h6v1a1 1 0 002 0v-1h1a1 1 0 000-2h-1V8h1a1 1 0 000-2h-1V5a1 1 0 00-2 0v1H7V5a1 1 0 00-1-1z"/></svg>,
    leaf:<svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M13.5 3C9.91 3 7 5.91 7 9.5c0 1.33.39 2.57 1.06 3.62L3.29 17.9a1 1 0 001.42 1.4l4.78-4.77A6.5 6.5 0 1013.5 3z" clipRule="evenodd"/></svg>,
    pen:<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-2.207 2.207L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>,
    run:<svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75v-5.59l-2.47 2.47a.75.75 0 01-1.06-1.06l3.75-3.75a.75.75 0 011.06 0l3.75 3.75a.75.75 0 11-1.06 1.06L10.75 10.66v5.59A.75.75 0 0110 17z" clipRule="evenodd"/></svg>,
    flame:<svg viewBox="0 0 20 20" fill="currentColor"><path d="M15.99 9.674c0 4.418-2.686 7.576-6 7.576s-6-3.158-6-7.576C3.99 6.385 5.775 4.16 8.04 2.86a.75.75 0 011.15.748 5.057 5.057 0 00.663 3.14c.208.323.61.481.986.344 1.354-.487 2.157-1.657 2.157-3.484a.75.75 0 011.15-.748c2.265 1.3 4.05 3.524 4.05 6.814h-.157z"/></svg>,
    star:<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"/></svg>,
    music:<svg viewBox="0 0 20 20" fill="currentColor"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/></svg>,
    sun:<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zm6.31 2.69a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zm-12.62 0a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06L4.63 5.75a.75.75 0 010-1.06zM10 6a4 4 0 100 8 4 4 0 000-8zm8 4a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM3.5 10.75H2a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5z"/></svg>,
  }
  return <span style={{display:'inline-flex',width:size,height:size,color,flexShrink:0}}>{icons[id]||icons.bolt}</span>
}

const ICON_IDS = ['droplet','bolt','book','moon','heart','brain','dumbbell','leaf','pen','run','flame','star','music','sun']
const SLabel = ({children}:{children:React.ReactNode}) => (
  <div style={{fontSize:9,fontWeight:600,letterSpacing:'0.14em',color:T.fgDim,textTransform:'uppercase',marginBottom:9}}>{children}</div>
)

interface Props {
  habit: Habit | null
  onSave: (data: Partial<HabitInsert>) => Promise<void>
  onClose: () => void
}

export default function HabitSheet({ habit, onSave, onClose }: Props) {
  const isNew = !habit?.id
  const [label,      setLabel]      = useState(habit?.label        || '')
  const [iconId,     setIconId]     = useState(habit?.icon_id      || 'bolt')
  const [colorId,    setColorId]    = useState(habit?.color_id     || 'gold')
  const [catId,      setCatId]      = useState(habit?.category_id  || 'health')
  const [goal,       setGoal]       = useState(habit?.goal         ?? 7)
  const [goalType,   setGoalType]   = useState(habit?.goal_type    || 'days')
  const [schedDays,  setSchedDays]  = useState<number[]>(habit?.schedule_days || [0,1,2,3,4,5,6])
  const [reminderOn, setReminderOn] = useState(habit?.reminder_on  || false)
  const [reminder,   setReminder]   = useState(habit?.reminder_time || '08:00')
  const [iconMode,   setIconMode]   = useState<'preset'|'emoji'>('preset')
  const [customEmoji,setCustomEmoji]= useState(habit?.custom_emoji || '')
  const [customColor,setCustomColor]= useState(habit?.custom_color || '')
  const [saving,     setSaving]     = useState(false)

  const col = customColor ? { hex: customColor } : (COLORS.find(c => c.id === colorId) || COLORS[0])
  const valid = label.trim().length > 0
  const toggleDay = (d: number) =>
    setSchedDays(s => s.includes(d) ? s.filter(x => x !== d) : [...s, d].sort())

  const handleSave = async () => {
    if (!valid || saving) return
    setSaving(true)
    await onSave({
      label: label.trim(), icon_id: iconId, color_id: colorId,
      category_id: catId, goal, goal_type: goalType as 'days'|'specific',
      schedule_days: goalType === 'specific' ? schedDays : [0,1,2,3,4,5,6],
      reminder_time: reminderOn ? reminder : null, reminder_on: reminderOn,
      custom_emoji: customEmoji || null, custom_color: customColor || null,
      position: 0, archived: false,
    })
    setSaving(false)
  }

  return (
    <div style={{position:'fixed',inset:0,zIndex:60,display:'flex',alignItems:'flex-end',
      background:'rgba(0,0,0,0.8)',animation:`fadeIn .2s ${E} both`}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{width:'100%',borderRadius:'20px 20px 0 0',background:T.surface,
        boxShadow:`${T.shadowOut},0 -4px 40px rgba(0,0,0,0.6)`,
        padding:'20px 20px 44px',animation:`slideUp .35s ${E} both`,maxHeight:'93vh',overflowY:'auto'}}>
        <div style={{width:32,height:3,borderRadius:2,background:T.border,margin:'0 auto 22px'}}/>
        <div className="serif" style={{fontSize:18,color:T.fg,marginBottom:22}}>{isNew?'New habit':'Edit habit'}</div>

        <SLabel>Name</SLabel>
        <div style={{background:T.sunken,borderRadius:12,boxShadow:T.shadowIn,marginBottom:20}}>
          <input value={label} onChange={e=>setLabel(e.target.value)} placeholder="e.g. Morning run"
            style={{width:'100%',padding:'13px 14px',background:'transparent',border:'none',color:T.fg,fontSize:15,outline:'none',fontFamily:'inherit'}}/>
        </div>

        <SLabel>Category</SLabel>
        <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:20}}>
          {CATEGORIES.map(c=>(
            <button key={c.id} onClick={()=>setCatId(c.id)} style={{
              padding:'6px 12px',borderRadius:99,fontFamily:'inherit',
              border:`1px solid ${catId===c.id?c.color+'55':T.border}`,
              background:catId===c.id?`${c.color}10`:T.surface,
              boxShadow:catId===c.id?T.shadowSm:T.shadowBtn,
              color:catId===c.id?c.color:T.fgMuted,fontSize:12,fontWeight:500,cursor:'pointer'}}>
              {c.label}
            </button>
          ))}
        </div>

        <SLabel>Icon</SLabel>
        <div style={{display:'flex',gap:7,marginBottom:10}}>
          {(['preset','emoji'] as const).map(id=>(
            <button key={id} onClick={()=>setIconMode(id)} style={{
              padding:'5px 12px',borderRadius:99,fontFamily:'inherit',
              border:`1px solid ${iconMode===id?col.hex+'55':T.border}`,
              background:iconMode===id?`${col.hex}10`:T.surface,
              boxShadow:iconMode===id?T.shadowSm:T.shadowBtn,
              color:iconMode===id?col.hex:T.fgMuted,fontSize:11,fontWeight:600,cursor:'pointer',textTransform:'capitalize'}}>
              {id}
            </button>
          ))}
        </div>
        {iconMode==='preset'?(
          <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:20}}>
            {ICON_IDS.map(ic=>{
              const active=ic===iconId&&!customEmoji
              return (
                <button key={ic} onClick={()=>{setIconId(ic);setCustomEmoji('')}} style={{
                  width:40,height:40,borderRadius:11,background:T.surface,
                  boxShadow:active?T.shadowIn:T.shadowBtn,
                  border:`1px solid ${active?col.hex+'44':T.border}`,
                  cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Icon id={ic} size={16} color={active?col.hex:T.fgMuted}/>
                </button>
              )
            })}
          </div>
        ):(
          <div style={{marginBottom:20}}>
            <div style={{background:T.sunken,borderRadius:12,boxShadow:T.shadowIn,marginBottom:10,display:'flex',alignItems:'center',gap:12,padding:'10px 14px'}}>
              <input value={customEmoji} onChange={e=>setCustomEmoji(e.target.value.slice(-2))} placeholder="Paste emoji"
                style={{flex:1,background:'transparent',border:'none',color:T.fg,fontSize:22,outline:'none',fontFamily:'inherit'}}/>
              <span style={{fontSize:13,color:T.fgDim}}>Preview: {customEmoji||'?'}</span>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
              {['🏏','⚽','🏀','🎯','🧠','💊','🥗','🎸','📝','🌿','💧','🛌','🏊','🚴','📖','💻','🎨','🤝','☀️','🌙','⚡','🦁','🔥','✦'].map(em=>(
                <button key={em} onClick={()=>setCustomEmoji(em)} style={{
                  width:36,height:36,borderRadius:9,
                  background:customEmoji===em?`${col.hex}18`:T.surface,
                  boxShadow:customEmoji===em?T.shadowIn:T.shadowBtn,
                  border:`1px solid ${customEmoji===em?col.hex+'44':T.border}`,
                  fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>{em}</button>
              ))}
            </div>
          </div>
        )}

        <SLabel>Color</SLabel>
        <div style={{display:'flex',flexWrap:'wrap',gap:9,marginBottom:8}}>
          {COLORS.map(c=>(
            <button key={c.id} onClick={()=>{setColorId(c.id);setCustomColor('')}} style={{
              width:26,height:26,borderRadius:'50%',background:c.hex,cursor:'pointer',outline:'none',padding:0,border:'none',
              boxShadow:colorId===c.id&&!customColor?`0 0 0 2px ${T.surface},0 0 0 4px ${c.hex}`:T.shadowSm}}/>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
          <input type="color" value={customColor||col.hex} onChange={e=>setCustomColor(e.target.value)}
            style={{width:34,height:34,borderRadius:10,border:`1px solid ${T.border}`,padding:2,cursor:'pointer',background:T.surface,boxShadow:T.shadowSm}}/>
          <div style={{flex:1,background:T.sunken,borderRadius:10,boxShadow:T.shadowIn}}>
            <input value={customColor} onChange={e=>setCustomColor(e.target.value)} placeholder="Custom hex"
              style={{width:'100%',padding:'9px 12px',background:'transparent',border:'none',color:T.fg,fontSize:13,outline:'none',fontFamily:'inherit'}}/>
          </div>
          {customColor&&<div style={{width:26,height:26,borderRadius:'50%',background:customColor,boxShadow:T.shadowSm,flexShrink:0}}/>}
        </div>

        <SLabel>Schedule</SLabel>
        <div style={{display:'flex',gap:7,marginBottom:10}}>
          {([['days','×/week'],['specific','Specific days']] as const).map(([id,lb])=>(
            <button key={id} onClick={()=>setGoalType(id)} style={{
              padding:'6px 12px',borderRadius:99,fontFamily:'inherit',
              border:`1px solid ${goalType===id?col.hex+'55':T.border}`,
              background:goalType===id?`${col.hex}10`:T.surface,
              boxShadow:goalType===id?T.shadowSm:T.shadowBtn,
              color:goalType===id?col.hex:T.fgMuted,fontSize:12,fontWeight:500,cursor:'pointer'}}>{lb}</button>
          ))}
        </div>
        {goalType==='days'?(
          <div style={{display:'flex',gap:7,marginBottom:20,alignItems:'center'}}>
            {[3,4,5,6,7].map(n=>(
              <button key={n} onClick={()=>setGoal(n)} style={{
                width:36,height:36,borderRadius:10,fontFamily:'inherit',background:T.surface,
                boxShadow:goal===n?T.shadowIn:T.shadowBtn,
                border:`1px solid ${goal===n?col.hex+'44':T.border}`,
                color:goal===n?col.hex:T.fgMuted,fontSize:13,fontWeight:600,cursor:'pointer'}}>{n}</button>
            ))}
            <span style={{fontSize:12,color:T.fgDim}}>days/wk</span>
          </div>
        ):(
          <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
            {DAY_LABELS.map((d,i)=>(
              <button key={i} onClick={()=>toggleDay(i)} style={{
                width:36,height:36,borderRadius:10,fontFamily:'inherit',background:T.surface,
                boxShadow:schedDays.includes(i)?T.shadowIn:T.shadowBtn,
                border:`1px solid ${schedDays.includes(i)?col.hex+'44':T.border}`,
                color:schedDays.includes(i)?col.hex:T.fgMuted,fontSize:11,fontWeight:600,cursor:'pointer'}}>
                {d.slice(0,2)}
              </button>
            ))}
          </div>
        )}

        <SLabel>Reminder</SLabel>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:28}}>
          <NeuToggle on={reminderOn} onToggle={()=>setReminderOn(v=>!v)}/>
          {reminderOn&&(
            <div style={{background:T.sunken,borderRadius:10,boxShadow:T.shadowIn}}>
              <input type="time" value={reminder} onChange={e=>setReminder(e.target.value)}
                style={{padding:'9px 12px',background:'transparent',border:'none',color:T.fg,fontSize:14,fontFamily:'inherit',outline:'none'}}/>
            </div>
          )}
          <span style={{fontSize:12,color:T.fgDim}}>{reminderOn?'Daily reminder':'Off'}</span>
        </div>

        <NeuBtn onClick={handleSave} accent={valid} disabled={!valid||saving} style={{width:'100%',marginBottom:10,opacity:valid?1:0.4}}>
          {saving?'Saving…':'Save habit'}
        </NeuBtn>
        <NeuBtn onClick={onClose} style={{width:'100%'}}>Cancel</NeuBtn>
      </div>
    </div>
  )
}
