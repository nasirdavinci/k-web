/*
 * SoundTouch JS audio processing library
 * Copyright (c) Olli Parviainen
 * Copyright (c) Ryan Berdeen
 * @GNU Lesser General License
 */

!function(t){var e=[[124,186,248,310,372,434,496,558,620,682,744,806,868,930,992,1054,1116,1178,1240,1302,1364,1426,1488,0],[-100,-75,-50,-25,25,50,75,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[-20,-15,-10,-5,5,10,15,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[-4,-3,-2,-1,1,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];function i(t,e){for(var i in e){var r=e.__lookupGetter__(i),s=e.__lookupSetter__(i);r||s?(r&&t.__defineGetter__(i,r),s&&t.__defineSetter__(i,s)):t[i]=e[i]}return t}function r(t,e){return(t>e?t-e:e-t)>1e-10}function s(t){t?(this.inputBuffer=new u,this.outputBuffer=new u):this.inputBuffer=this.outputBuffer=null}function o(t){s.call(this,t),this._reset(),this.rate=1}function u(){this._vector=new Float32Array,this._position=0,this._frameCount=0}function h(t,e){this._pipe=e,this.sourceSound=t,this.historyBufferSize=22050,this._sourcePosition=0,this.outputBufferPosition=0,this._position=0}function n(t,e){s.call(this,t),this.bQuickSeek=!0,this.bMidBufferDirty=!1,this.pMidBuffer=null,this.overlapLength=0,this.bAutoSeqSetting=!0,this.bAutoSeekSetting=!0,this._tempo=1,this.setParameters(e,0,0,8)}function f(t){this.rateTransposer=new o(!1),this.tdStretch=new n(!1,t),this._inputBuffer=new u,this._intermediateBuffer=new u,this._outputBuffer=new u,this._rate=0,this._tempo=0,this.virtualPitch=1,this.virtualRate=1,this.virtualTempo=1,this._calculateEffectiveRateAndTempo()}function a(t){this.buffer=t}s.prototype={get inputBuffer(){return this._inputBuffer},set inputBuffer(t){this._inputBuffer=t},get outputBuffer(){return this._outputBuffer},set outputBuffer(t){this._outputBuffer=t},clear:function(){this._inputBuffer.clear(),this._outputBuffer.clear()}},i(o.prototype,s.prototype),i(o.prototype,{set rate(t){this._rate=t},_reset:function(){this.slopeCount=0,this.prevSampleL=0,this.prevSampleR=0},process:function(){var t=this._inputBuffer.frameCount;this._outputBuffer.ensureAdditionalCapacity(t/this._rate+1);var e=this._transpose(t);this._inputBuffer.receive(),this._outputBuffer.put(e)},_transpose:function(t){if(0===t)return 0;for(var e=this._inputBuffer.vector,i=this._inputBuffer.startIndex,r=this._outputBuffer.vector,s=this._outputBuffer.endIndex,o=0,u=0;this.slopeCount<1;)r[s+2*u]=(1-this.slopeCount)*this.prevSampleL+this.slopeCount*e[i],r[s+2*u+1]=(1-this.slopeCount)*this.prevSampleR+this.slopeCount*e[i+1],u++,this.slopeCount+=this._rate;if(this.slopeCount-=1,1!=t)t:for(;;){for(;this.slopeCount>1;)if(this.slopeCount-=1,++o>=t-1)break t;var h=i+2*o;r[s+2*u]=(1-this.slopeCount)*e[h]+this.slopeCount*e[h+2],r[s+2*u+1]=(1-this.slopeCount)*e[h+1]+this.slopeCount*e[h+3],u++,this.slopeCount+=this._rate}return this.prevSampleL=e[i+2*t-2],this.prevSampleR=e[i+2*t-1],u}}),u.prototype={get vector(){return this._vector},get position(){return this._position},get startIndex(){return 2*this._position},get frameCount(){return this._frameCount},get endIndex(){return 2*(this._position+this._frameCount)},clear:function(t){this.receive(t),this.rewind()},put:function(t){this._frameCount+=t},putSamples:function(t,e,i){var r=2*(e=e||0);i>=0||(i=(t.length-r)/2);var s=2*i;this.ensureCapacity(i+this._frameCount);var o=this.endIndex;this._vector.set(t.subarray(r,r+s),o),this._frameCount+=i},putBuffer:function(t,e,i){e=e||0,i>=0||(i=t.frameCount-e),this.putSamples(t.vector,t.position+e,i)},receive:function(t){t>=0&&!(t>this._frameCount)||(t=this._frameCount),this._frameCount-=t,this._position+=t},receiveSamples:function(t,e){var i=2*e,r=this.startIndex;t.set(this._vector.subarray(r,r+i)),this.receive(e)},extract:function(t,e,i){var r=this.startIndex+2*e,s=2*i;t.set(this._vector.subarray(r,r+s))},ensureCapacity:function(t){var e=2*t;if(this._vector.length<e){var i=new Float32Array(e);i.set(this._vector.subarray(this.startIndex,this.endIndex)),this._vector=i,this._position=0}else this.rewind()},ensureAdditionalCapacity:function(t){this.ensureCapacity(this.frameCount+t)},rewind:function(){this._position>0&&(this._vector.set(this._vector.subarray(this.startIndex,this.endIndex)),this._position=0)}},h.prototype={get pipe(){return this._pipe},get position(){return this._position},set position(t){if(t>this._position)throw new RangeError("New position may not be greater than current position");var e=this.outputBufferPosition-(this._position-t);if(e<0)throw new RangeError("New position falls outside of history buffer");this.outputBufferPosition=e,this._position=t},get sourcePosition(){return this._sourcePosition},set sourcePosition(t){this.clear(),this._sourcePosition=t},get inputBuffer(){return this._pipe.inputBuffer},get outputBuffer(){return this._pipe.outputBuffer},fillInputBuffer:function(t){var e=new Float32Array(2*t),i=this.sourceSound.extract(e,t,this._sourcePosition);this._sourcePosition+=i,this.inputBuffer.putSamples(e,0,i)},fillOutputBuffer:function(t){for(;this.outputBuffer.frameCount<t;){var e=16384-this.inputBuffer.frameCount;if(this.fillInputBuffer(e),this.inputBuffer.frameCount<16384)break;this._pipe.process()}},extract:function(t,e){this.fillOutputBuffer(this.outputBufferPosition+e);var i=Math.min(e,this.outputBuffer.frameCount-this.outputBufferPosition);this.outputBuffer.extract(t,this.outputBufferPosition,i);var r=this.outputBufferPosition+i;return this.outputBufferPosition=Math.min(this.historyBufferSize,r),this.outputBuffer.receive(Math.max(r-this.historyBufferSize,0)),this._position+=i,i},handleSampleData:function(t){this.extract(t.data,4096)},clear:function(){this._pipe.clear(),this.outputBufferPosition=0}},i(n.prototype,s.prototype),i(n.prototype,{clear:function(){s.prototype.clear.call(this),this._clearMidBuffer()},_clearMidBuffer:function(){this.bMidBufferDirty&&(this.bMidBufferDirty=!1,this.pMidBuffer=null)},setParameters:function(t,e,i,r){t>0&&(this.sampleRate=t),r>0&&(this.overlapMs=r),e>0?(this.sequenceMs=e,this.bAutoSeqSetting=!1):this.bAutoSeqSetting=!0,i>0?(this.seekWindowMs=i,this.bAutoSeekSetting=!1):this.bAutoSeekSetting=!0,this.calcSeqParameters(),this.calculateOverlapLength(this.overlapMs),this.tempo=this._tempo},set tempo(t){var e;this._tempo=t,this.calcSeqParameters(),this.nominalSkip=this._tempo*(this.seekWindowLength-this.overlapLength),this.skipFract=0,e=Math.floor(this.nominalSkip+.5),this.sampleReq=Math.max(e+this.overlapLength,this.seekWindowLength)+this.seekLength},get inputChunkSize(){return this.sampleReq},get outputChunkSize(){return this.overlapLength+Math.max(0,this.seekWindowLength-2*this.overlapLength)},calculateOverlapLength:function(t){var e;(e=this.sampleRate*t/1e3)<16&&(e=16),e-=e%8,this.overlapLength=e,this.pRefMidBuffer=new Float32Array(2*this.overlapLength),this.pMidBuffer=new Float32Array(2*this.overlapLength)},checkLimits:function(t,e,i){return t<e?e:t>i?i:t},calcSeqParameters:function(){var t,e;this.bAutoSeqSetting&&(t=150+-50*this._tempo,t=this.checkLimits(t,50,125),this.sequenceMs=Math.floor(t+.5)),this.bAutoSeekSetting&&(e=25- -10/1.5*.5+-10/1.5*this._tempo,e=this.checkLimits(e,15,25),this.seekWindowMs=Math.floor(e+.5)),this.seekWindowLength=Math.floor(this.sampleRate*this.sequenceMs/1e3),this.seekLength=Math.floor(this.sampleRate*this.seekWindowMs/1e3)},set quickSeek(t){this.bQuickSeek=t},seekBestOverlapPosition:function(){return this.bQuickSeek?this.seekBestOverlapPositionStereoQuick():this.seekBestOverlapPositionStereo()},seekBestOverlapPositionStereo:function(){var t,e,i,r;for(this.precalcCorrReferenceStereo(),e=Number.MIN_VALUE,t=0,r=0;r<this.seekLength;r++)(i=this.calcCrossCorrStereo(2*r,this.pRefMidBuffer))>e&&(e=i,t=r);return t},seekBestOverlapPositionStereoQuick:function(){var t,i,r,s,o,u,h;for(this.precalcCorrReferenceStereo(),r=Number.MIN_VALUE,i=0,u=0,h=0,o=0;o<4;o++){for(t=0;e[o][t]&&!((h=u+e[o][t])>=this.seekLength);)(s=this.calcCrossCorrStereo(2*h,this.pRefMidBuffer))>r&&(r=s,i=h),t++;u=i}return i},precalcCorrReferenceStereo:function(){var t,e,i;for(t=0;t<this.overlapLength;t++)i=t*(this.overlapLength-t),e=2*t,this.pRefMidBuffer[e]=this.pMidBuffer[e]*i,this.pRefMidBuffer[e+1]=this.pMidBuffer[e+1]*i},calcCrossCorrStereo:function(t,e){var i,r,s,o=this._inputBuffer.vector;for(t+=this._inputBuffer.startIndex,i=0,r=2;r<2*this.overlapLength;r+=2)i+=o[s=r+t]*e[r]+o[s+1]*e[r+1];return i},overlap:function(t){this.overlapStereo(2*t)},overlapStereo:function(t){var e=this._inputBuffer.vector;t+=this._inputBuffer.startIndex;var i,r,s,o,u,h,n,f=this._outputBuffer.vector,a=this._outputBuffer.endIndex;for(o=1/this.overlapLength,i=0;i<this.overlapLength;i++)s=(this.overlapLength-i)*o,u=i*o,h=(r=2*i)+t,f[(n=r+a)+0]=e[h+0]*u+this.pMidBuffer[r+0]*s,f[n+1]=e[h+1]*u+this.pMidBuffer[r+1]*s},process:function(){var t,e,i;if(null===this.pMidBuffer){if(this._inputBuffer.frameCount<this.overlapLength)return;this.pMidBuffer=new Float32Array(2*this.overlapLength),this._inputBuffer.receiveSamples(this.pMidBuffer,this.overlapLength)}for(;this._inputBuffer.frameCount>=this.sampleReq;){e=this.seekBestOverlapPosition(),this._outputBuffer.ensureAdditionalCapacity(this.overlapLength),this.overlap(Math.floor(e)),this._outputBuffer.put(this.overlapLength),(i=this.seekWindowLength-2*this.overlapLength)>0&&this._outputBuffer.putBuffer(this._inputBuffer,e+this.overlapLength,i);var r=this.inputBuffer.startIndex+2*(e+this.seekWindowLength-this.overlapLength);this.pMidBuffer.set(this._inputBuffer.vector.subarray(r,r+2*this.overlapLength)),this.skipFract+=this.nominalSkip,t=Math.floor(this.skipFract),this.skipFract-=t,this._inputBuffer.receive(t)}}}),i(n.prototype,{get tempo(){return this._tempo}}),f.prototype={clear:function(){this.rateTransposer.clear(),this.tdStretch.clear()},get rate(){return this._rate},set rate(t){this.virtualRate=t,this._calculateEffectiveRateAndTempo()},set rateChange(t){this.rate=1+.01*t},get tempo(){return this._tempo},set tempo(t){this.virtualTempo=t,this._calculateEffectiveRateAndTempo()},set tempoChange(t){this.tempo=1+.01*t},set pitch(t){this.virtualPitch=t,this._calculateEffectiveRateAndTempo()},set pitchOctaves(t){this.pitch=Math.exp(.69314718056*t),this._calculateEffectiveRateAndTempo()},set pitchSemitones(t){this.pitchOctaves=t/12},get inputBuffer(){return this._inputBuffer},get outputBuffer(){return this._outputBuffer},_calculateEffectiveRateAndTempo:function(){var t=this._tempo,e=this._rate;this._tempo=this.virtualTempo/this.virtualPitch,this._rate=this.virtualRate*this.virtualPitch,r(this._tempo,t)&&(this.tdStretch.tempo=this._tempo),r(this._rate,e)&&(this.rateTransposer.rate=this._rate),this._rate>1?this._outputBuffer!=this.rateTransposer.outputBuffer&&(this.tdStretch.inputBuffer=this._inputBuffer,this.tdStretch.outputBuffer=this._intermediateBuffer,this.rateTransposer.inputBuffer=this._intermediateBuffer,this.rateTransposer.outputBuffer=this._outputBuffer):this._outputBuffer!=this.tdStretch.outputBuffer&&(this.rateTransposer.inputBuffer=this._inputBuffer,this.rateTransposer.outputBuffer=this._intermediateBuffer,this.tdStretch.inputBuffer=this._intermediateBuffer,this.tdStretch.outputBuffer=this._outputBuffer)},process:function(){this._rate>1?(this.tdStretch.process(),this.rateTransposer.process()):(this.rateTransposer.process(),this.tdStretch.process())}},a.prototype={extract:function(t,e,i){for(var r=this.buffer.getChannelData(0),s=this.buffer.getChannelData(1),o=0;o<e;o++)t[2*o]=r[o+i],t[2*o+1]=s[o+i];return Math.min(e,r.length-i)}},t.soundtouch={RateTransposer:o,Stretch:n,SimpleFilter:h,SoundTouch:f,WebAudioBufferSource:a,getWebAudioNode:function(t,e){var i=t.createScriptProcessor(4096,2,2),r=new Float32Array(8192);return i.onaudioprocess=function(t){var s=t.outputBuffer.getChannelData(0),o=t.outputBuffer.getChannelData(1),u=e.extract(r,4096);0===u&&i.disconnect();for(var h=0;h<u;h++)s[h]=r[2*h],o[h]=r[2*h+1]},i}}}(this);