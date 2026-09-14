import assert from "node:assert/strict";
import { test } from "node:test";
import { parseTodos, readTodosSnapshot, saveTodos, subscribeTodos } from "../lib/storage";
import { sampleTodos } from "../types/todo";

test("old text records migrate without losing completion or priority", () => {
  assert.deepEqual(parseTodos(JSON.stringify([{id:"old",text:"Legacy task",completed:true,priority:"high"}])),
    [{id:"old",title:"Legacy task",completed:true,priority:"high"}]);
});

test("missing or invalid priorities normalize to medium", () => {
  for (const priority of [undefined, "urgent", null, {}]) {
    assert.equal(parseTodos(JSON.stringify([{id:"one",title:"Task",completed:false,priority}]))[0].priority,"medium");
  }
});

test("saved empty arrays remain empty", () => { assert.deepEqual(parseTodos("[]"),[]); });

test("malformed data and duplicate identifiers cannot crash the app", () => {
  for (const raw of ["{", "{}", "[null]", '[{"id":2,"text":"x","completed":false}]',
    JSON.stringify([{id:"same",title:"A",completed:false},{id:"same",title:"B",completed:true}])]) {
    assert.deepEqual(parseTodos(raw),sampleTodos);
  }
});

test("SSR reads require no browser and cannot write", () => {
  assert.equal(readTodosSnapshot(),null);
  assert.equal(saveTodos([]),false);
});

test("storage fallback, successful notifications, and denied writes", () => {
  const values=new Map([["todos",'[{"id":"legacy","text":"Old","completed":false}]']]);
  let denied=false;
  const events=new EventTarget();
  const previous=Object.getOwnPropertyDescriptor(globalThis,"window");
  Object.defineProperty(globalThis,"window",{configurable:true,value:{
    localStorage:{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{if(denied)throw new Error("quota");values.set(key,value);}},
    addEventListener:events.addEventListener.bind(events),removeEventListener:events.removeEventListener.bind(events),
  }});
  try {
    assert.equal(readTodosSnapshot(),values.get("todos"));
    let changes=0;const unsubscribe=subscribeTodos(()=>changes++);
    assert.equal(saveTodos([]),true);assert.equal(changes,1);assert.equal(readTodosSnapshot(),"[]");
    denied=true;assert.equal(saveTodos(sampleTodos),false);assert.equal(changes,1);assert.equal(readTodosSnapshot(),"[]");
    unsubscribe();denied=false;saveTodos(sampleTodos);assert.equal(changes,1);
  } finally {
    if(previous)Object.defineProperty(globalThis,"window",previous);else Reflect.deleteProperty(globalThis,"window");
  }
});
